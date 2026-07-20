<?php

use App\Http\Controllers\BreedController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GenderController;
use App\Http\Controllers\HorseController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\VaccineController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Horse records
    Route::get('horses', [HorseController::class, 'index'])->name('horses.index');
    Route::post('horses', [HorseController::class, 'store'])->name('horses.store');
    Route::get('horses/{horse}', [HorseController::class, 'show'])->name('horses.show');
    Route::delete('horses/{horse}', [HorseController::class, 'destroy'])->name('horses.destroy');

    Route::resource('monitorings', MonitoringController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('medical-records', MedicalRecordController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('vaccinations', VaccinationController::class)->only(['index', 'store', 'update', 'destroy']);

    // Reference data
    Route::resource('breeds', BreedController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('genders', GenderController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('suppliers', SupplierController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('vaccines', VaccineController::class)->only(['index', 'store', 'update', 'destroy']);

    // Admin only. The gate is defined in AppServiceProvider.
    Route::get('users', fn () => Inertia::render('users/index'))
        ->middleware('can:admin')
        ->name('users.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
