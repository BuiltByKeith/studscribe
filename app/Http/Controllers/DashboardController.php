<?php

namespace App\Http\Controllers;

use App\Models\Breed;
use App\Models\BreedingRecord;
use App\Models\Horse;
use App\Models\Monitoring;
use App\Models\Supplier;
use App\Models\Vaccination;
use App\Models\Vaccine;
use Illuminate\Support\Carbon;
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
            'breedingSchedule' => $this->breedingSchedule(),
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

    /**
     * Breeding pairs, soonest next check first.
     *
     * Every stage (cover, each cycle, each 21-day check) is 21 days apart, so
     * the next expected event is always the most recently recorded date plus
     * 21 days -- there is no stored "next due" column to sort by directly, so
     * this is computed in PHP rather than the database. Fine at farm scale.
     *
     * @return array<int, array<string, mixed>>
     */
    private function breedingSchedule(): array
    {
        return BreedingRecord::query()
            ->with(['stallion:id,horse_name,horse_image', 'mare:id,horse_name,horse_image'])
            ->get()
            ->map(function (BreedingRecord $record) {
                [$label, $recentDate] = $this->mostRecentBreedingStage($record);
                $nextDue = $recentDate->copy()->addDays(21);

                return [
                    'id' => $record->id,
                    'stallion_name' => $record->stallion?->horse_name,
                    'stallion_image' => $record->stallion?->imageUrl(),
                    'mare_name' => $record->mare?->horse_name,
                    'mare_image' => $record->mare?->imageUrl(),
                    'last_breeding_date' => $record->last_breeding_date?->toDateString(),
                    'recent_label' => $label,
                    'recent_date' => $recentDate->toDateString(),
                    'next_due_date' => $nextDue->toDateString(),
                    'next_label' => $this->nextBreedingStageLabel($label),
                    'is_overdue' => $nextDue->isPast(),
                ];
            })
            ->sortBy('next_due_date')
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * The breeding timeline in order, field name to display label.
     *
     * Single source of truth for both the "what's the furthest-along stage
     * recorded" walk and the "what comes after that stage" lookup, so the two
     * can never drift into naming a different stage by mistake. Cycle 4 has
     * no 21-day field in the schema, so the timeline ends there.
     *
     * @var array<string, string>
     */
    private const STAGE_FIELDS = [
        'last_breeding_date' => 'Last Breeding',
        'cycle_1_date' => '1st Cycle',
        'cycle_1_day21_date' => '21st Day (1st)',
        'cycle_2_date' => '2nd Cycle',
        'cycle_2_day21_date' => '21st Day (2nd)',
        'cycle_3_date' => '3rd Cycle',
        'cycle_3_day21_date' => '21st Day (3rd)',
        'cycle_4_date' => '4th Cycle',
    ];

    /**
     * The furthest-along stage recorded for a pairing, and its date.
     *
     * Walks the timeline backwards -- 4th cycle, 3rd cycle's 21-day check,
     * 3rd cycle, and so on -- so it returns the latest thing actually
     * recorded rather than a fixed field. Falls back to the last breeding
     * date when no cycle has been logged yet, which is always set.
     *
     * @return array{0: string, 1: Carbon}
     */
    private function mostRecentBreedingStage(BreedingRecord $record): array
    {
        foreach (array_reverse(self::STAGE_FIELDS, true) as $field => $label) {
            if ($record->{$field} !== null) {
                return [$label, $record->{$field}];
            }
        }

        return ['Last Breeding', $record->last_breeding_date];
    }

    /**
     * The stage expected after the given one, or null once the timeline runs
     * out (nothing is recorded, or cycle 4 -- the farm's last tracked cycle --
     * is already the most recent stage).
     */
    private function nextBreedingStageLabel(string $currentLabel): ?string
    {
        $labels = array_values(self::STAGE_FIELDS);
        $index = array_search($currentLabel, $labels, true);

        if ($index === false || ! isset($labels[$index + 1])) {
            return null;
        }

        return $labels[$index + 1];
    }
}
