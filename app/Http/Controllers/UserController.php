<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = max(5, min((int) $request->integer('per_page', 10), 50));

        $users = User::query()
            ->with('roles:id,title')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn (Role $role) => ['id' => $role->id, 'title' => $role->title]),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            // The model casts `password` as `hashed`, so the plain value is
            // hashed on assignment -- no explicit Hash::make here.
            'password' => $data['password'],
        ]);
        $user->roles()->sync($data['role_ids'] ?? []);

        return back()->with('success', 'User added.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            // Blank means "leave the password as is" -- only validated as a
            // real password when the admin actually typed one.
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            ...(filled($data['password'] ?? null) ? ['password' => $data['password']] : []),
        ]);
        $user->roles()->sync($data['role_ids'] ?? []);

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        // A locked-out admin has no way back in short of touching the
        // database directly, so self-deletion is refused outright.
        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'roles' => Role::orderBy('title')->get(['id', 'title']),
        ];
    }
}
