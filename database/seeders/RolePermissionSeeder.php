<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

/**
 * Roles and the permissions each carries.
 *
 * Nothing enforces these yet -- this seeds the authorization *data*. Gates,
 * policies, and middleware are deliberately out of scope for this pass.
 */
class RolePermissionSeeder extends Seeder
{
    /**
     * Permission titles grouped by the resource they govern.
     *
     * @var array<string, list<string>>
     */
    private const PERMISSIONS = [
        'horse' => ['view', 'create', 'edit', 'delete'],
        'monitoring' => ['view', 'create', 'edit', 'delete'],
        'medical_record' => ['view', 'create', 'edit', 'delete'],
        'vaccination' => ['view', 'create', 'edit', 'delete'],
        'supplier' => ['view', 'manage'],
        'user' => ['view', 'manage'],
    ];

    /**
     * Which resources each role may act on. 'view' means read-only access.
     *
     * @var array<string, array<string, list<string>>>
     */
    private const ROLES = [
        'Admin' => ['*' => ['*']],
        'Manager' => [
            'horse' => ['view', 'create', 'edit'],
            'monitoring' => ['view', 'create', 'edit'],
            'medical_record' => ['view', 'create', 'edit'],
            'vaccination' => ['view', 'create', 'edit'],
            'supplier' => ['view', 'manage'],
            'user' => ['view'],
        ],
        'Staff' => [
            'horse' => ['view'],
            'monitoring' => ['view', 'create'],
            'medical_record' => ['view'],
            'vaccination' => ['view', 'create'],
        ],
    ];

    public function run(): void
    {
        $permissions = [];

        foreach (self::PERMISSIONS as $resource => $actions) {
            foreach ($actions as $action) {
                $title = "{$resource}.{$action}";
                $permissions[$title] = Permission::firstOrCreate(['title' => $title]);
            }
        }

        foreach (self::ROLES as $roleTitle => $grants) {
            $role = Role::firstOrCreate(['title' => $roleTitle]);

            $granted = isset($grants['*'])
                ? collect($permissions)
                : collect($grants)->flatMap(
                    fn (array $actions, string $resource) => collect($actions)
                        ->map(fn (string $action) => $permissions["{$resource}.{$action}"] ?? null)
                        ->filter(),
                );

            $role->permissions()->sync($granted->pluck('id')->all());
        }
    }
}
