<?php

namespace Database\Factories;

use App\Models\Horse;
use App\Models\Vaccine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vaccination>
 */
class VaccinationFactory extends Factory
{
    public function definition(): array
    {
        $administered = fake()->dateTimeBetween('-18 months', 'now');

        return [
            'horse_id' => Horse::factory(),
            'vaccine_id' => Vaccine::factory(),
            'date_administered' => $administered->format('Y-m-d'),
            // Boosters typically fall 6 or 12 months out.
            'next_due_date' => (clone $administered)
                ->modify('+'.fake()->randomElement([6, 12]).' months')
                ->format('Y-m-d'),
            'administered_by' => null,
            'dosage' => fake()->randomElement(['1 mL', '2 mL', '5 mL']),
            'notes' => fake()->optional(0.3)->sentence(8),
        ];
    }

    /**
     * A vaccination whose booster is already past due.
     */
    public function overdue(): static
    {
        return $this->state(fn () => [
            'date_administered' => fake()->dateTimeBetween('-3 years', '-18 months')->format('Y-m-d'),
            'next_due_date' => fake()->dateTimeBetween('-12 months', '-1 day')->format('Y-m-d'),
        ]);
    }
}
