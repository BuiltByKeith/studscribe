<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Order matters: lookups and roles must exist before HorseSeeder, which
     * reads them rather than generating its own.
     */
    public function run(): void
    {
        $this->call([
            LookupSeeder::class,
            RolePermissionSeeder::class,
        ]);

        $owner = User::firstOrCreate(
            ['email' => 'builtbykeith.dev@gmail.com'],
            ['name' => 'Allen Keith Aradillos', 'password' => 'password'],
        );

        $staff = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => 'password'],
        );

        if ($admin = Role::where('title', 'Admin')->first()) {
            $owner->roles()->syncWithoutDetaching([$admin->id]);
        }

        if ($staffRole = Role::where('title', 'Staff')->first()) {
            $staff->roles()->syncWithoutDetaching([$staffRole->id]);
        }

        $this->call([
            HorseSeeder::class,
        ]);
    }
}
