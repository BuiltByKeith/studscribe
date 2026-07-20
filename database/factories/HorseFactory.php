<?php

namespace Database\Factories;

use App\Models\Breed;
use App\Models\Gender;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Horse>
 */
class HorseFactory extends Factory
{
    /**
     * Names that read like horses rather than like people.
     *
     * @var list<string>
     */
    private const NAME_PARTS_FIRST = [
        'Midnight', 'Golden', 'Silver', 'Thunder', 'Shadow', 'Storm', 'Autumn',
        'Royal', 'Wild', 'Northern', 'Crimson', 'Velvet', 'Iron', 'Summer',
    ];

    /**
     * @var list<string>
     */
    private const NAME_PARTS_SECOND = [
        'Runner', 'Dancer', 'Spirit', 'Crown', 'Arrow', 'Blaze', 'Whisper',
        'Legacy', 'Star', 'Quest', 'Reign', 'Song', 'Comet', 'Echo',
    ];

    public function definition(): array
    {
        $birthDate = fake()->dateTimeBetween('-18 years', '-2 years');

        // A horse is acquired after it is born, never before.
        $acquisitionDate = fake()->dateTimeBetween($birthDate, 'now');

        return [
            'horse_name' => fake()->randomElement(self::NAME_PARTS_FIRST).' '
                .fake()->randomElement(self::NAME_PARTS_SECOND),
            'registration_no' => strtoupper(fake()->unique()->bothify('??-####-###')),
            'sex' => fake()->randomElement(['male', 'female']),
            'gender_id' => Gender::factory(),
            'breed_id' => Breed::factory(),
            'supplier_id' => Supplier::factory(),
            'color' => fake()->randomElement([
                'Bay', 'Chestnut', 'Black', 'Grey', 'Palomino', 'Roan', 'Buckskin', 'Dun',
            ]),
            'birth_date' => $birthDate->format('Y-m-d'),
            'acquisition_date' => $acquisitionDate->format('Y-m-d'),
            'retirement_date' => null,
            'description' => fake()->sentence(14),
            'sire' => fake()->randomElement(self::NAME_PARTS_FIRST).' '
                .fake()->randomElement(self::NAME_PARTS_SECOND),
            'dam' => fake()->randomElement(self::NAME_PARTS_FIRST).' '
                .fake()->randomElement(self::NAME_PARTS_SECOND),
            'parent_info' => fake()->sentence(10),
            'breed_percentage' => fake()->randomElement([100.00, 100.00, 75.00, 50.00, 87.50]),
            'horse_image' => null,
        ];
    }

    /**
     * A retired horse -- reachable state the UI needs to render differently.
     */
    public function retired(): static
    {
        return $this->state(fn (array $attributes) => [
            'retirement_date' => fake()
                ->dateTimeBetween($attributes['acquisition_date'], 'now')
                ->format('Y-m-d'),
        ]);
    }

    /**
     * A horse with no registration on file.
     */
    public function unregistered(): static
    {
        return $this->state(fn () => ['registration_no' => null]);
    }
}
