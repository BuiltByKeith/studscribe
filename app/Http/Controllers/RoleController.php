<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $roles = Role::query()
            ->with('permissions:id,title')
            ->withCount('users')
            ->orderBy('title')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Role $role) => [
                'id' => $role->id,
                'title' => $role->title,
                'permissions' => $role->permissions->map(fn (Permission $p) => ['id' => $p->id, 'title' => $p->title]),
                'users_count' => $role->users_count,
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $role = Role::create(['title' => $data['title']]);
        $role->permissions()->sync($data['permission_ids'] ?? []);

        return back()->with('success', 'Role added.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $data = $this->validated($request, $role);

        $role->update(['title' => $data['title']]);
        $role->permissions()->sync($data['permission_ids'] ?? []);

        return back()->with('success', 'Role updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return back()->with('success', 'Role deleted.');
    }

    /**
     * @return array{title: string, permission_ids?: list<int>}
     */
    private function validated(Request $request, ?Role $role = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('roles', 'title')->ignore($role?->id)],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'permissions' => Permission::orderBy('title')->get(['id', 'title']),
        ];
    }
}
