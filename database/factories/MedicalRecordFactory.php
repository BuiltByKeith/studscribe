<?php

namespace Database\Factories;

use App\Models\Horse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalRecord>
 */
class MedicalRecordFactory extends Factory
{
    /**
     * @var list<string>
     */
    private const DIAGNOSES = [
        'Mild lameness, left fore',
        'Colic, resolved',
        'Hoof abscess',
        'Respiratory infection',
        'Routine dental check',
        'Skin allergy',
        'Tendon strain',
    ];

    /**
     * @var list<string>
     */
    private const TREATMENTS = [
        'Rest and anti-inflammatories for 10 days',
        'Oral fluids and monitoring',
        'Poultice and box rest',
        'Course of antibiotics',
        'Teeth floated',
        'Topical treatment, diet adjusted',
        'Cold therapy and controlled exercise',
    ];

    public function definition(): array
    {
        return [
            'horse_id' => Horse::factory(),
            'visit_date' => fake()->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'diagnosis' => fake()->randomElement(self::DIAGNOSES),
            'treatment' => fake()->randomElement(self::TREATMENTS),
            // An external practitioner -- deliberately a string, not a user FK.
            'veterinarian' => 'Dr. '.fake()->lastName(),
            'notes' => fake()->optional(0.5)->sentence(12),
        ];
    }
}
