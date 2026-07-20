<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Gender;
use App\Models\Supplier;
use App\Models\Vaccine;
use Illuminate\Database\Seeder;

/**
 * Reference data.
 *
 * Seeded from fixed lists rather than factories: a stud farm has real breeds
 * and real equine gender terms, and faker output here would make the app look
 * broken the moment anyone opened a dropdown.
 */
class LookupSeeder extends Seeder
{
    public function run(): void
    {
        $breeds = [
            ['name' => 'Thoroughbred', 'description' => 'Hot-blooded breed best known for racing and athleticism.'],
            ['name' => 'Arabian', 'description' => 'One of the oldest breeds, prized for endurance and stamina.'],
            ['name' => 'Quarter Horse', 'description' => 'Excels at sprinting short distances; the most popular breed in the US.'],
            ['name' => 'Warmblood', 'description' => 'Middle-weight sport horse used in dressage and show jumping.'],
            ['name' => 'Standardbred', 'description' => 'Bred for harness racing at trot and pace.'],
            ['name' => 'Andalusian', 'description' => 'Spanish breed known for its elegance and presence in classical dressage.'],
            ['name' => 'Appaloosa', 'description' => 'Recognisable by its spotted coat patterns.'],
        ];

        foreach ($breeds as $breed) {
            Breed::firstOrCreate(['name' => $breed['name']], $breed);
        }

        // Equine life-stage-and-status terms -- distinct from horses.sex.
        $genders = [
            ['name' => 'Stallion', 'sex' => 'male', 'description' => 'An intact adult male kept for breeding.'],
            ['name' => 'Mare', 'sex' => 'female', 'description' => 'An adult female horse.'],
            ['name' => 'Gelding', 'sex' => 'male', 'description' => 'A castrated adult male.'],
            ['name' => 'Colt', 'sex' => 'male', 'description' => 'A young male horse, not yet mature.'],
            ['name' => 'Filly', 'sex' => 'female', 'description' => 'A young female horse, not yet mature.'],
        ];

        foreach ($genders as $gender) {
            Gender::firstOrCreate(['name' => $gender['name']], $gender);
        }

        $vaccines = [
            ['name' => 'Tetanus Toxoid', 'manufacturer' => 'Zoetis', 'dose' => '1 mL'],
            ['name' => 'Eastern/Western Equine Encephalomyelitis', 'manufacturer' => 'Merck Animal Health', 'dose' => '1 mL'],
            ['name' => 'West Nile Virus', 'manufacturer' => 'Zoetis', 'dose' => '1 mL'],
            ['name' => 'Equine Influenza', 'manufacturer' => 'Boehringer Ingelheim', 'dose' => '2 mL'],
            ['name' => 'Equine Herpesvirus (Rhinopneumonitis)', 'manufacturer' => 'Merck Animal Health', 'dose' => '2 mL'],
            ['name' => 'Rabies', 'manufacturer' => 'Boehringer Ingelheim', 'dose' => '1 mL'],
            ['name' => 'Strangles', 'manufacturer' => 'Zoetis', 'dose' => '2 mL'],
        ];

        foreach ($vaccines as $vaccine) {
            Vaccine::firstOrCreate(
                ['name' => $vaccine['name']],
                $vaccine + ['expiry_date' => now()->addMonths(fake()->numberBetween(8, 30))->toDateString()],
            );
        }

        $suppliers = [
            ['supplier_name' => 'Highfield Stud', 'contact' => '+63 917 555 0142', 'status' => 'active'],
            ['supplier_name' => 'Rivergate Equine', 'contact' => '+63 918 555 0198', 'status' => 'active'],
            ['supplier_name' => 'Ashgrove Bloodstock', 'contact' => '+63 920 555 0176', 'status' => 'active'],
            // One inactive supplier so the filtered/empty states are reachable.
            ['supplier_name' => 'Old Mill Farm', 'contact' => '+63 921 555 0110', 'status' => 'inactive'],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::firstOrCreate(
                ['supplier_name' => $supplier['supplier_name']],
                $supplier + ['address' => fake()->address()],
            );
        }
    }
}
