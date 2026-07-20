<?php

namespace Database\Factories;

use App\Models\Horse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Monitoring>
 *
 * Ranges below are normal adult equine vitals. Generating a 4000 bpm heart rate
 * would make the seeded data useless for eyeballing the UI.
 */
class MonitoringFactory extends Factory
{
    public function definition(): array
    {
        return [
            'horse_id' => Horse::factory(),
            'monitoring_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            // Withers height in centimetres. Stored in cm rather than hands
            // because "14.2 hands" means 14 hands 2 inches, not 14.2 -- a
            // decimal column cannot hold that notation without corrupting it.
            'height' => fake()->randomFloat(2, 142, 175),
            'weight' => fake()->randomFloat(2, 400, 600),
            'temperature' => fake()->randomFloat(1, 37.2, 38.3),
            'heart_rate' => fake()->numberBetween(28, 44),
            'respiratory_rate' => fake()->numberBetween(8, 16),
            // Henneke scale 1-9; 4-6 is the healthy band.
            'condition_score' => fake()->numberBetween(4, 6),
            'notes' => fake()->optional(0.4)->sentence(10),
            'checked_by' => null,
        ];
    }
}
