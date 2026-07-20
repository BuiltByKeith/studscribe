<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Breed>
 */
class BreedFactory extends Factory
{
    public function definition(): array
    {
        return [
            // Suffixed to stay unique -- `breeds.name` carries a unique index,
            // and the real breed list is seeded separately by LookupSeeder.
            'name' => fake()->unique()->word().' Breed',
            'description' => fake()->sentence(12),
        ];
    }
}
