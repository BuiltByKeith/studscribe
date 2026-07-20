<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaccines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('manufacturer')->nullable();
            $table->string('dose')->nullable();
            // DATE, not the ERD's VARCHAR -- comparing and sorting expiry is
            // the only thing this column exists to support.
            $table->date('expiry_date')->nullable();
            $table->timestamps();

            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccines');
    }
};
