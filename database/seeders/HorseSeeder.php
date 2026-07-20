<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Gender;
use App\Models\Horse;
use App\Models\MedicalRecord;
use App\Models\Monitoring;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Vaccination;
use App\Models\Vaccine;
use Illuminate\Database\Seeder;

/**
 * Sample horses with health history.
 *
 * Lookup IDs are passed to the factory as overrides rather than assigned after
 * the fact. HorseFactory's defaults are `Breed::factory()` and friends, and a
 * pending factory left in the attribute list gets resolved -- and persisted --
 * even by `make()`. Overriding the key discards the pending factory instead,
 * which is what keeps this seeder from spawning an orphan breed, gender, and
 * supplier per horse.
 */
class HorseSeeder extends Seeder
{
    public function run(): void
    {
        $breeds = Breed::pluck('id');
        $suppliers = Supplier::where('status', 'active')->pluck('id');
        $vaccines = Vaccine::pluck('id');
        $staff = User::pluck('id');

        if ($breeds->isEmpty() || $suppliers->isEmpty() || $vaccines->isEmpty()) {
            $this->command?->warn('LookupSeeder must run before HorseSeeder. Skipping.');

            return;
        }

        // Gender terms are sex-specific, so pick from the matching subset
        // rather than producing a "Stallion" that is also female.
        $gendersBySex = [
            'male' => Gender::whereIn('name', ['Stallion', 'Gelding', 'Colt'])->pluck('id')->all(),
            'female' => Gender::whereIn('name', ['Mare', 'Filly'])->pluck('id')->all(),
        ];

        $allGenders = Gender::pluck('id')->all();

        $horses = collect(range(1, 12))->map(function (int $i) use ($breeds, $suppliers, $gendersBySex, $allGenders) {
            $sex = fake()->randomElement(['male', 'female']);

            return Horse::factory()->create([
                'sex' => $sex,
                'breed_id' => $breeds->random(),
                'supplier_id' => $suppliers->random(),
                'gender_id' => fake()->randomElement($gendersBySex[$sex] ?: $allGenders),
                // Two retired horses so that state is reachable in the UI.
                'retirement_date' => $i <= 2
                    ? fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d')
                    : null,
            ]);
        });

        $this->linkPedigree($horses->values());

        // The last two horses are left with no records at all -- empty states
        // need to be reachable too.
        foreach ($horses->take(10) as $index => $horse) {
            Monitoring::factory()
                ->count(fake()->numberBetween(3, 6))
                ->create([
                    'horse_id' => $horse->id,
                    'checked_by' => $staff->isNotEmpty() ? $staff->random() : null,
                ]);

            MedicalRecord::factory()
                ->count(fake()->numberBetween(1, 3))
                ->create(['horse_id' => $horse->id]);

            Vaccination::factory()
                ->count(fake()->numberBetween(2, 4))
                ->create([
                    'horse_id' => $horse->id,
                    'vaccine_id' => $vaccines->random(),
                    'administered_by' => $staff->isNotEmpty() ? $staff->random() : null,
                ]);

            // The first two also get an overdue booster, so the "due for
            // vaccination" path has data to show.
            if ($index < 2) {
                Vaccination::factory()
                    ->overdue()
                    ->create([
                        'horse_id' => $horse->id,
                        'vaccine_id' => $vaccines->random(),
                        'administered_by' => $staff->isNotEmpty() ? $staff->random() : null,
                    ]);
            }
        }
    }

    /**
     * Wire a three-generation family so the pedigree tab has real lineage.
     *
     * Built oldest-first and by index rather than at random: a random pairing
     * can hand a horse a parent younger than itself, or close a cycle where two
     * horses end up as each other's ancestor.
     *
     * @param  \Illuminate\Support\Collection<int, Horse>  $horses
     */
    private function linkPedigree($horses): void
    {
        if ($horses->count() < 7) {
            return;
        }

        // Oldest first, so a parent is always born before its offspring.
        $ordered = $horses->sortBy(fn (Horse $horse) => $horse->birth_date?->timestamp ?? PHP_INT_MAX)->values();

        $males = $ordered->where('sex', 'male')->values();
        $females = $ordered->where('sex', 'female')->values();

        if ($males->count() < 3 || $females->count() < 3) {
            return;
        }

        // Generation 1: four grandparents.
        [$gpSire1, $gpSire2, $sire] = [$males[0], $males[1], $males[2]];
        [$gpDam1, $gpDam2, $dam] = [$females[0], $females[1], $females[2]];

        // Generation 2: the parents, each out of a grandparent pairing.
        $sire->update(['sire_id' => $gpSire1->id, 'dam_id' => $gpDam1->id, 'sire' => null, 'dam' => null]);
        $dam->update(['sire_id' => $gpSire2->id, 'dam_id' => $gpDam2->id, 'sire' => null, 'dam' => null]);

        // Generation 3: full siblings out of that pairing.
        //
        // Every horse already used above is excluded by id. Picking children by
        // position instead would let a parent be selected as its own child --
        // which is exactly how an earlier version produced a horse that was its
        // own sire, and a two-horse ancestry cycle.
        $used = [$gpSire1->id, $gpSire2->id, $gpDam1->id, $gpDam2->id, $sire->id, $dam->id];

        // A child must be born after both of its parents. `$ordered` is
        // oldest-first, so taking from the front would hand the pairing horses
        // older than themselves -- the children come from the young end, and
        // are then filtered against the parents' actual birth dates.
        $youngest = max(
            $sire->birth_date?->timestamp ?? PHP_INT_MIN,
            $dam->birth_date?->timestamp ?? PHP_INT_MIN,
        );

        $children = $ordered
            ->reject(fn (Horse $horse) => in_array($horse->id, $used, true))
            ->filter(fn (Horse $horse) => ($horse->birth_date?->timestamp ?? PHP_INT_MIN) > $youngest)
            ->sortByDesc(fn (Horse $horse) => $horse->birth_date?->timestamp ?? 0)
            ->take(3);

        foreach ($children as $child) {
            $child->update(['sire_id' => $sire->id, 'dam_id' => $dam->id, 'sire' => null, 'dam' => null]);
        }
    }
}
