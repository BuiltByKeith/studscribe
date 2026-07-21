<?php

namespace App\Http\Controllers;

use App\Models\BreedingRecord;
use App\Models\Horse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BreedingRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $breedingRecords = BreedingRecord::query()
            ->with([
                'stallion:id,horse_name,horse_image',
                'mare:id,horse_name,horse_image',
            ])
            ->orderByDesc('last_breeding_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (BreedingRecord $record) => [
                'id' => $record->id,
                'stallion_id' => $record->stallion_id,
                'stallion_name' => $record->stallion?->horse_name,
                'stallion_image' => $record->stallion?->imageUrl(),
                'mare_id' => $record->mare_id,
                'mare_name' => $record->mare?->horse_name,
                'mare_image' => $record->mare?->imageUrl(),
                'last_breeding_date' => $record->last_breeding_date?->toDateString(),
                'cycle_1_date' => $record->cycle_1_date?->toDateString(),
                'cycle_1_day21_date' => $record->cycle_1_day21_date?->toDateString(),
                'cycle_1_notes' => $record->cycle_1_notes,
                'cycle_2_date' => $record->cycle_2_date?->toDateString(),
                'cycle_2_day21_date' => $record->cycle_2_day21_date?->toDateString(),
                'cycle_2_notes' => $record->cycle_2_notes,
                'cycle_3_date' => $record->cycle_3_date?->toDateString(),
                'cycle_3_day21_date' => $record->cycle_3_day21_date?->toDateString(),
                'cycle_3_notes' => $record->cycle_3_notes,
                'cycle_4_date' => $record->cycle_4_date?->toDateString(),
                'cycle_4_notes' => $record->cycle_4_notes,
            ]);

        return Inertia::render('breeding-records/index', [
            'breedingRecords' => $breedingRecords,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        BreedingRecord::create($this->validated($request));

        return back()->with('success', 'Breeding record added.');
    }

    public function update(Request $request, BreedingRecord $breeding_record): RedirectResponse
    {
        $breeding_record->update($this->validated($request));

        return back()->with('success', 'Breeding record updated.');
    }

    public function destroy(BreedingRecord $breeding_record): RedirectResponse
    {
        $breeding_record->delete();

        return back()->with('success', 'Breeding record deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'stallion_id' => ['required', 'integer', 'exists:horses,id'],
            'mare_id' => ['required', 'integer', 'different:stallion_id', 'exists:horses,id'],
            'last_breeding_date' => ['required', 'date', 'before_or_equal:today'],

            'cycle_1_date' => ['nullable', 'date'],
            'cycle_1_day21_date' => ['nullable', 'date'],
            'cycle_1_notes' => ['nullable', 'string', 'max:2000'],

            'cycle_2_date' => ['nullable', 'date'],
            'cycle_2_day21_date' => ['nullable', 'date'],
            'cycle_2_notes' => ['nullable', 'string', 'max:2000'],

            'cycle_3_date' => ['nullable', 'date'],
            'cycle_3_day21_date' => ['nullable', 'date'],
            'cycle_3_notes' => ['nullable', 'string', 'max:2000'],

            'cycle_4_date' => ['nullable', 'date'],
            'cycle_4_notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'stallions' => Horse::where('sex', 'male')->orderBy('horse_name')->get(['id', 'horse_name']),
            'mares' => Horse::where('sex', 'female')->orderBy('horse_name')->get(['id', 'horse_name']),
        ];
    }
}
