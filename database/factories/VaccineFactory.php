<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vaccine>
 */
class VaccineFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word().' Vaccine',
            'manufacturer' => fake()->company(),
            'dose' => fake()->randomElement(['1 mL', '2 mL', '5 mL']),
            'expiry_date' => fake()->dateTimeBetween('+6 months', '+3 years')->format('Y-m-d'),
        ];
    }

    /**
     * A vaccine past its expiry -- the state any "expired stock" view needs.
     */
    public function expired(): static
    {
        return $this->state(fn () => [
            'expiry_date' => fake()->dateTimeBetween('-2 years', '-1 day')->format('Y-m-d'),
        ]);
    }
}
