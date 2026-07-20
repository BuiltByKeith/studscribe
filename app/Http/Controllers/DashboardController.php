<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\Horse;
use App\Models\Monitoring;
use App\Models\Supplier;
use App\Models\Vaccination;
use App\Models\Vaccine;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Farm-wide overview: headline counts, recent wellness readings, and the
     * vaccination schedule coming due.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'horses' => Horse::count(),
                'breeds' => Breed::count(),
                'suppliers' => Supplier::count(),
                'vaccines' => Vaccine::count(),
            ],
            'wellness' => $this->recentWellness(),
            'upcomingVaccinations' => $this->upcomingVaccinations(),
        ]);
    }

    /**
     * Newest 5 monitoring readings across every horse.
     *
     * @return array<int, array<string, mixed>>
     */
    private function recentWellness(): array
    {
        return Monitoring::query()
            ->with(['horse:id,horse_name,horse_image', 'checkedBy:id,name'])
            ->orderByDesc('monitoring_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Monitoring $monitoring) => [
                'id' => $monitoring->id,
                'horse_name' => $monitoring->horse?->horse_name,
                'horse_image' => $monitoring->horse?->imageUrl(),
                'monitoring_date' => $monitoring->monitoring_date?->toDateString(),
                'condition_score' => $monitoring->condition_score,
                'checked_by' => $monitoring->checkedBy?->name,
            ])
            ->all();
    }

    /**
     * The vaccination schedule, up to 5 rows.
     *
     * Upcoming doses (not yet due) fill the list first, soonest first --
     * that is what "what's coming up" means on a dashboard. Only once there
     * are no more upcoming doses left to show do overdue ones take the
     * remaining slots, closest-to-today first, so an old backlog can't push
     * a dose due next week off the list entirely.
     *
     * @return array<int, array<string, mixed>>
     */
    private function upcomingVaccinations(): array
    {
        $today = today()->toDateString();

        $upcoming = Vaccination::query()
            ->whereNotNull('next_due_date')
            ->where('next_due_date', '>', $today)
            ->with(['horse:id,horse_name,horse_image', 'vaccine:id,name'])
            ->orderBy('next_due_date')
            ->limit(5)
            ->get();

        $remaining = 5 - $upcoming->count();

        $overdue = $remaining > 0
            ? Vaccination::query()
                ->whereNotNull('next_due_date')
                ->where('next_due_date', '<=', $today)
                ->with(['horse:id,horse_name,horse_image', 'vaccine:id,name'])
                ->orderByDesc('next_due_date')
                ->limit($remaining)
                ->get()
            : collect();

        return $upcoming->concat($overdue)
            ->map(fn (Vaccination $vaccination) => [
                'id' => $vaccination->id,
                'horse_name' => $vaccination->horse?->horse_name,
                'horse_image' => $vaccination->horse?->imageUrl(),
                'vaccine' => $vaccination->vaccine?->name,
                'next_due_date' => $vaccination->next_due_date?->toDateString(),
                'is_overdue' => $vaccination->isOverdue(),
            ])
            ->all();
    }
}
