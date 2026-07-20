<?php

namespace App\Http\Controllers;

use App\Models\Horse;
use App\Models\User;
use App\Models\Vaccination;
use App\Models\Vaccine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VaccinationController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $vaccinations = Vaccination::query()
            ->with(['horse:id,horse_name,horse_image', 'vaccine:id,name', 'administeredBy:id,name'])
            ->orderByDesc('date_administered')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Vaccination $vaccination) => [
                'id' => $vaccination->id,
                'horse_id' => $vaccination->horse_id,
                'horse_name' => $vaccination->horse?->horse_name,
                'horse_image' => $vaccination->horse?->imageUrl(),
                'vaccine_id' => $vaccination->vaccine_id,
                'vaccine' => $vaccination->vaccine?->name,
                'date_administered' => $vaccination->date_administered?->toDateString(),
                'next_due_date' => $vaccination->next_due_date?->toDateString(),
                'is_overdue' => $vaccination->isOverdue(),
                'administered_by_id' => $vaccination->administered_by,
                'administered_by' => $vaccination->administeredBy?->name,
                'dosage' => $vaccination->dosage,
                'notes' => $vaccination->notes,
            ]);

        return Inertia::render('vaccinations/index', [
            'vaccinations' => $vaccinations,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Vaccination::create($this->validated($request));

        return back()->with('success', 'Vaccination recorded.');
    }

    public function update(Request $request, Vaccination $vaccination): RedirectResponse
    {
        $vaccination->update($this->validated($request));

        return back()->with('success', 'Vaccination updated.');
    }

    public function destroy(Vaccination $vaccination): RedirectResponse
    {
        $vaccination->delete();

        return back()->with('success', 'Vaccination deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'horse_id' => ['required', 'integer', 'exists:horses,id'],
            'vaccine_id' => ['required', 'integer', 'exists:vaccines,id'],
            'date_administered' => ['required', 'date', 'before_or_equal:today'],
            'next_due_date' => ['nullable', 'date', 'after_or_equal:date_administered'],
            'administered_by' => ['nullable', 'integer', 'exists:users,id'],
            'dosage' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'horses' => Horse::orderBy('horse_name')->get(['id', 'horse_name']),
            'vaccines' => Vaccine::orderBy('name')->get(['id', 'name']),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ];
    }
}
