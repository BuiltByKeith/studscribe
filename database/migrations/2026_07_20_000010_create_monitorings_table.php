<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitorings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained()->cascadeOnDelete();
            $table->date('monitoring_date');

            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 6, 2)->nullable();
            $table->decimal('temperature', 4, 1)->nullable();
            $table->unsignedSmallInteger('heart_rate')->nullable();
            $table->unsignedSmallInteger('respiratory_rate')->nullable();

            // Henneke body condition, 1-9. The ERD typed this BIT, which can
            // only hold 0 or 1.
            $table->unsignedTinyInteger('condition_score')->nullable();

            $table->text('notes')->nullable();

            // The staff member who took the reading. Nulled rather than
            // cascaded on user deletion -- turnover must not erase health
            // history.
            $table->foreignId('checked_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index('monitoring_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitorings');
    }
};
