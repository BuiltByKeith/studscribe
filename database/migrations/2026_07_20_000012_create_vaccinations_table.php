<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaccinations', function (Blueprint $table) {
            // `id`, not the ERD's `vaccination_id` -- avoids a $primaryKey
            // override on one model out of eleven.
            $table->id();

            $table->foreignId('horse_id')->constrained()->cascadeOnDelete();

            // Restrict, not cascade: a vaccination is a medical record.
            // Removing a vaccine from the catalog must not erase the fact that
            // it was administered. Deactivate the vaccine instead.
            $table->foreignId('vaccine_id')->constrained()->restrictOnDelete();

            $table->date('date_administered');
            $table->date('next_due_date')->nullable();
            $table->foreignId('administered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('dosage')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('date_administered');
            // Drives any "due for vaccination" listing.
            $table->index('next_due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccinations');
    }
};
