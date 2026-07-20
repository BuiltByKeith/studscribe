<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor',
        'two_factor_code',
        'two_factor_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor' => 'boolean',
            'two_factor_expires_at' => 'datetime',
        ];
    }

    /**
     * Roles granted to this user.
     *
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Monitoring readings this user recorded.
     *
     * @return HasMany<Monitoring, $this>
     */
    public function monitoringsChecked(): HasMany
    {
        return $this->hasMany(Monitoring::class, 'checked_by');
    }

    /**
     * Vaccinations this user administered.
     *
     * @return HasMany<Vaccination, $this>
     */
    public function vaccinationsAdministered(): HasMany
    {
        return $this->hasMany(Vaccination::class, 'administered_by');
    }

    /**
     * Determine whether the user holds the given role.
     */
    public function hasRole(string $title): bool
    {
        return $this->roles->contains(fn (Role $role) => $role->title === $title);
    }

    /**
     * Determine whether any of the user's roles grants the given permission.
     *
     * Resolves through the roles relation rather than querying directly, so an
     * eager-loaded `roles.permissions` avoids repeat queries. There is no cache
     * layer here by design -- see the authorization decision in
     * docs/plans/2026-07-20-002-feat-erd-schema-and-models-plan.md.
     */
    public function hasPermission(string $title): bool
    {
        return $this->roles
            ->loadMissing('permissions')
            ->pluck('permissions')
            ->flatten()
            ->contains(fn (Permission $permission) => $permission->title === $title);
    }
}
