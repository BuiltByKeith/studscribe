<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $permissions = Permission::query()
            ->withCount('roles')
            ->orderBy('title')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Permission $permission) => [
                'id' => $permission->id,
                'title' => $permission->title,
                'roles_count' => $permission->roles_count,
            ]);

        return Inertia::render('permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('permissions', 'title')],
        ]);

        Permission::create($data);

        return back()->with('success', 'Permission added.');
    }

    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255', Rule::unique('permissions', 'title')->ignore($permission->id)],
        ]);

        $permission->update($data);

        return back()->with('success', 'Permission updated.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $permission->delete();

        return back()->with('success', 'Permission deleted.');
    }
}
