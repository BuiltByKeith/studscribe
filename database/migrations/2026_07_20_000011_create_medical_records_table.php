<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained()->cascadeOnDelete();
            $table->date('visit_date');
            $table->text('diagnosis')->nullable();
            $table->text('treatment')->nullable();

            // Stays a string, unlike checked_by/administered_by: a treating vet
            // is typically an external practitioner with no account, and an FK
            // here would mean creating users for people who never log in.
            $table->string('veterinarian')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('visit_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
