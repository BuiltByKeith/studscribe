<?php

namespace App\Http\Controllers;

use App\Models\Horse;
use App\Models\MedicalRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $medicalRecords = MedicalRecord::query()
            ->with(['horse:id,horse_name,horse_image'])
            ->orderByDesc('visit_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (MedicalRecord $record) => [
                'id' => $record->id,
                'horse_id' => $record->horse_id,
                'horse_name' => $record->horse?->horse_name,
                'horse_image' => $record->horse?->imageUrl(),
                'visit_date' => $record->visit_date?->toDateString(),
                'veterinarian' => $record->veterinarian,
                'diagnosis' => $record->diagnosis,
                'treatment' => $record->treatment,
                'notes' => $record->notes,
            ]);

        return Inertia::render('medical-records/index', [
            'medicalRecords' => $medicalRecords,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        MedicalRecord::create($this->validated($request));

        return back()->with('success', 'Medical record added.');
    }

    public function update(Request $request, MedicalRecord $medical_record): RedirectResponse
    {
        $medical_record->update($this->validated($request));

        return back()->with('success', 'Medical record updated.');
    }

    public function destroy(MedicalRecord $medical_record): RedirectResponse
    {
        $medical_record->delete();

        return back()->with('success', 'Medical record deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'horse_id' => ['required', 'integer', 'exists:horses,id'],
            'visit_date' => ['required', 'date', 'before_or_equal:today'],
            'diagnosis' => ['nullable', 'string', 'max:2000'],
            'treatment' => ['nullable', 'string', 'max:2000'],
            'veterinarian' => ['nullable', 'string', 'max:255'],
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
        ];
    }
}
