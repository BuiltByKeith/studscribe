<?php

namespace Database\Factories;

use App\Models\BreedingRecord;
use App\Models\Horse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BreedingRecord>
 */
class BreedingRecordFactory extends Factory
{
    public function definition(): array
    {
        $lastBreedingDate = fake()->dateTimeBetween('-3 months', 'now');

        return [
            'stallion_id' => Horse::factory()->state(['sex' => 'male']),
            'mare_id' => Horse::factory()->state(['sex' => 'female']),
            'last_breeding_date' => $lastBreedingDate->format('Y-m-d'),
            'cycle_1_date' => null,
            'cycle_1_day21_date' => null,
            'cycle_1_notes' => null,
            'cycle_2_date' => null,
            'cycle_2_day21_date' => null,
            'cycle_2_notes' => null,
            'cycle_3_date' => null,
            'cycle_3_day21_date' => null,
            'cycle_3_notes' => null,
            'cycle_4_date' => null,
            'cycle_4_notes' => null,
        ];
    }
}
