<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('breeding_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stallion_id')->constrained('horses')->cascadeOnDelete();
            $table->foreignId('mare_id')->constrained('horses')->cascadeOnDelete();

            // Date of the most recent breeding event for this pair. Holds the
            // first mate date until cycle 1 is recorded, then is updated in
            // place as breeding continues -- the record tracks one ongoing
            // pairing rather than one row per mating.
            $table->date('last_breeding_date');

            $table->date('cycle_1_date')->nullable();
            $table->date('cycle_1_day21_date')->nullable();
            $table->text('cycle_1_notes')->nullable();

            $table->date('cycle_2_date')->nullable();
            $table->date('cycle_2_day21_date')->nullable();
            $table->text('cycle_2_notes')->nullable();

            $table->date('cycle_3_date')->nullable();
            $table->date('cycle_3_day21_date')->nullable();
            $table->text('cycle_3_notes')->nullable();

            $table->date('cycle_4_date')->nullable();
            $table->text('cycle_4_notes')->nullable();

            $table->timestamps();

            $table->index(['stallion_id', 'mare_id']);
            $table->index('last_breeding_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('breeding_records');
    }
};
