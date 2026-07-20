<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Guards the user-management area. Routes enforce this via
        // `can:admin`; the sidebar hides the link using the `is_admin` prop
        // shared from HandleInertiaRequests. Hiding the link is cosmetic --
        // the gate on the route is what actually protects the page.
        Gate::define('admin', fn (User $user) => $user->hasRole('Admin'));
    }
}
