<?php

namespace App\Http\Controllers;

use App\Models\Horse;
use App\Models\Monitoring;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $monitorings = Monitoring::query()
            ->with(['horse:id,horse_name,horse_image', 'checkedBy:id,name'])
            ->orderByDesc('monitoring_date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Monitoring $monitoring) => [
                'id' => $monitoring->id,
                'horse_id' => $monitoring->horse_id,
                'horse_name' => $monitoring->horse?->horse_name,
                'horse_image' => $monitoring->horse?->imageUrl(),
                'monitoring_date' => $monitoring->monitoring_date?->toDateString(),
                'height' => $monitoring->height,
                'weight' => $monitoring->weight,
                'temperature' => $monitoring->temperature,
                'heart_rate' => $monitoring->heart_rate,
                'respiratory_rate' => $monitoring->respiratory_rate,
                'condition_score' => $monitoring->condition_score,
                'checked_by_id' => $monitoring->checked_by,
                'checked_by' => $monitoring->checkedBy?->name,
                'notes' => $monitoring->notes,
            ]);

        return Inertia::render('monitorings/index', [
            'monitorings' => $monitorings,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Monitoring::create($this->validated($request));

        return back()->with('success', 'Monitoring reading added.');
    }

    public function update(Request $request, Monitoring $monitoring): RedirectResponse
    {
        $monitoring->update($this->validated($request));

        return back()->with('success', 'Monitoring reading updated.');
    }

    public function destroy(Monitoring $monitoring): RedirectResponse
    {
        $monitoring->delete();

        return back()->with('success', 'Monitoring reading deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'horse_id' => ['required', 'integer', 'exists:horses,id'],
            'monitoring_date' => ['required', 'date', 'before_or_equal:today'],
            'height' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:9999.99'],
            'temperature' => ['nullable', 'numeric', 'min:0', 'max:999.9'],
            'heart_rate' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'respiratory_rate' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'condition_score' => ['nullable', 'integer', 'min:1', 'max:10'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'checked_by' => ['nullable', 'integer', 'exists:users,id'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'horses' => Horse::orderBy('horse_name')->get(['id', 'horse_name']),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ];
    }
}
