<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHorseRequest;
use App\Models\Breed;
use App\Models\Gender;
use App\Models\Horse;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HorseController extends Controller
{
    /**
     * Paginated horse index.
     */
    public function index(Request $request): Response
    {
        $perPage = (int) $request->integer('per_page', 10);

        // Clamp so a crafted ?per_page=100000 cannot ask the database for the
        // entire table in one query.
        $perPage = max(5, min($perPage, 50));

        $horses = Horse::query()
            // Eager-loaded to keep the row count at 4 queries rather than
            // 3 per row.
            ->with(['breed:id,name', 'gender:id,name', 'supplier:id,supplier_name'])
            ->orderBy('horse_name')
            ->paginate($perPage)
            // Preserves per_page (and any future filters) across page links.
            ->withQueryString()
            ->through(fn (Horse $horse) => [
                'id' => $horse->id,
                'horse_name' => $horse->horse_name,
                'birth_date' => $horse->birth_date?->toDateString(),
                'sex' => $horse->sex,
                'gender' => $horse->gender?->name,
                'sire' => $horse->sire,
                'dam' => $horse->dam,
                'breed' => $horse->breed?->name,
                'breed_percentage' => $horse->breed_percentage,
                'supplier' => $horse->supplier?->supplier_name,
                'color' => $horse->color,
                'registration_no' => $horse->registration_no,
                'horse_image' => $horse->imageUrl(),
            ]);

        return Inertia::render('horses/index', [
            'horses' => $horses,
            // Select options for the add-horse form. Small enough (a few dozen
            // rows total) that sending them with each page beats the complexity
            // of a partial-reload dance.
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Persist a new horse.
     */
    public function store(StoreHorseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('horse_image')) {
            // `store` assigns a random filename, so a user-supplied name can
            // never dictate the path on disk. Only the relative path is
            // persisted -- the public URL is derived at read time, which keeps
            // the rows valid if the disk or domain ever changes.
            $data['horse_image'] = $request->file('horse_image')->store('horses', 'public');
        } else {
            unset($data['horse_image']);
        }

        $horse = Horse::create($data);

        return to_route('horses.index')->with('success', "{$horse->horse_name} was added.");
    }

    /**
     * Health history for the monitoring, vaccination, and medical tabs.
     *
     * Newest first throughout -- the most recent reading is what anyone opening
     * a horse's file is looking for.
     *
     * @return array<string, mixed>
     */
    private function recordsFor(Horse $horse): array
    {
        return [
            'monitorings' => $horse->monitorings()
                ->with('checkedBy:id,name')
                ->orderByDesc('monitoring_date')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'monitoring_date' => $m->monitoring_date?->toDateString(),
                    'height' => $m->height,
                    'weight' => $m->weight,
                    'temperature' => $m->temperature,
                    'heart_rate' => $m->heart_rate,
                    'respiratory_rate' => $m->respiratory_rate,
                    'condition_score' => $m->condition_score,
                    'checked_by' => $m->checkedBy?->name,
                    'notes' => $m->notes,
                ]),

            'vaccinations' => $horse->vaccinations()
                ->with(['vaccine:id,name', 'administeredBy:id,name'])
                ->orderByDesc('date_administered')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'date_administered' => $v->date_administered?->toDateString(),
                    'next_due_date' => $v->next_due_date?->toDateString(),
                    'is_overdue' => $v->isOverdue(),
                    'vaccine' => $v->vaccine?->name,
                    'dosage' => $v->dosage,
                    'administered_by' => $v->administeredBy?->name,
                    'notes' => $v->notes,
                ]),

            'medical_records' => $horse->medicalRecords()
                ->orderByDesc('visit_date')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($r) => [
                    'id' => $r->id,
                    'visit_date' => $r->visit_date?->toDateString(),
                    'veterinarian' => $r->veterinarian,
                    'diagnosis' => $r->diagnosis,
                    'treatment' => $r->treatment,
                    'notes' => $r->notes,
                ]),
        ];
    }

    /**
     * Ancestors, siblings, and offspring for the pedigree tab.
     *
     * @return array<string, mixed>
     */
    private function pedigreeFor(Horse $horse): array
    {
        return [
            'root' => $this->pedigreeNode($horse),
            // Depth 2 is grandparents. Each level doubles the node count, so
            // this is bounded deliberately rather than recursing until it runs
            // out of data.
            'ancestors' => $this->ancestorTree($horse, 2),
            'siblings' => $horse->siblings()
                ->with(['breed:id,name'])
                ->orderBy('horse_name')
                ->get()
                ->map(fn (Horse $sibling) => $this->pedigreeNode($sibling, $this->siblingKinship($horse, $sibling)))
                ->values(),
            'offspring' => $horse->offspring()
                ->with(['breed:id,name'])
                ->orderBy('horse_name')
                ->get()
                ->map(fn (Horse $child) => $this->pedigreeNode($child))
                ->values(),
        ];
    }

    /**
     * Parents, recursively, to the given depth.
     *
     * Returns null when a parent is neither linked nor named, so the client can
     * tell "unknown" apart from "known by name but not a record here".
     *
     * @return array<string, mixed>|null
     */
    private function ancestorTree(Horse $horse, int $depth): ?array
    {
        if ($depth < 1) {
            return null;
        }

        $build = function (?Horse $parent, ?string $name) use ($depth): ?array {
            if ($parent) {
                return $this->pedigreeNode($parent) + ['ancestors' => $this->ancestorTree($parent, $depth - 1)];
            }

            // Named but not a record on this farm: still worth showing as a
            // leaf, just without a link or any further lineage.
            return $name ? ['id' => null, 'horse_name' => $name, 'unlinked' => true] : null;
        };

        $horse->loadMissing(['sireHorse.breed:id,name', 'damHorse.breed:id,name']);

        $sire = $build($horse->sireHorse, $horse->sire);
        $dam = $build($horse->damHorse, $horse->dam);

        return $sire === null && $dam === null ? null : ['sire' => $sire, 'dam' => $dam];
    }

    /**
     * Whether a sibling shares both parents or only one.
     */
    private function siblingKinship(Horse $horse, Horse $sibling): string
    {
        $sharesSire = $horse->sire_id && $horse->sire_id === $sibling->sire_id;
        $sharesDam = $horse->dam_id && $horse->dam_id === $sibling->dam_id;

        return $sharesSire && $sharesDam ? 'Full sibling' : 'Half sibling';
    }

    /**
     * The card-sized projection of a horse used throughout the pedigree tree.
     *
     * @return array<string, mixed>
     */
    private function pedigreeNode(Horse $horse, ?string $kinship = null): array
    {
        return [
            'id' => $horse->id,
            'horse_name' => $horse->horse_name,
            'horse_image' => $horse->imageUrl(),
            'sex' => $horse->sex,
            'breed' => $horse->breed?->name,
            'birth_date' => $horse->birth_date?->toDateString(),
            'unlinked' => false,
            'kinship' => $kinship,
        ];
    }

    /**
     * Select options for the horse form.
     *
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'breeds' => Breed::orderBy('name')->get(['id', 'name']),
            'genders' => Gender::orderBy('name')->get(['id', 'name']),
            // Retired suppliers are not offered for new acquisitions, but
            // existing horses keep pointing at them.
            'suppliers' => Supplier::where('status', 'active')
                ->orderBy('supplier_name')
                ->get(['id', 'supplier_name']),
            // Candidate parents, split by sex so the sire list cannot offer a
            // mare. Horses with no recorded sex appear in both.
            'sires' => Horse::whereIn('sex', ['male'])->orWhereNull('sex')
                ->orderBy('horse_name')->get(['id', 'horse_name']),
            'dams' => Horse::whereIn('sex', ['female'])->orWhereNull('sex')
                ->orderBy('horse_name')->get(['id', 'horse_name']),
        ];
    }

    /**
     * Horse detail page. Intentionally bare for now.
     */
    public function show(Horse $horse): Response
    {
        $horse->load(['breed:id,name', 'gender:id,name', 'supplier:id,supplier_name']);

        return Inertia::render('horses/show', [
            'horse' => [
                'id' => $horse->id,
                'horse_name' => $horse->horse_name,
                'horse_image' => $horse->imageUrl(),
                'registration_no' => $horse->registration_no,
                'birth_date' => $horse->birth_date?->toDateString(),
                'acquisition_date' => $horse->acquisition_date?->toDateString(),
                'retirement_date' => $horse->retirement_date?->toDateString(),
                'supplier' => $horse->supplier?->supplier_name,
                'gender' => $horse->gender?->name,
                'sex' => $horse->sex,
                'color' => $horse->color,
                'breed' => $horse->breed?->name,
                'breed_percentage' => $horse->breed_percentage,
                'is_retired' => $horse->isRetired(),
            ],
            'pedigree' => $this->pedigreeFor($horse),
            'records' => $this->recordsFor($horse),
        ]);
    }

    /**
     * Delete a horse.
     *
     * Cascades to its monitorings, medical records, and vaccinations -- see the
     * delete rules in the schema plan. There is no soft delete on horses, so
     * this is permanent.
     */
    public function destroy(Horse $horse): RedirectResponse
    {
        $name = $horse->horse_name;
        $image = $horse->horse_image;

        $horse->delete();

        // Only after the row is gone, so a failed delete cannot orphan the
        // record from its photo.
        if ($image) {
            Storage::disk('public')->delete($image);
        }

        return back()->with('success', "{$name} and all of its records were deleted.");
    }
}
