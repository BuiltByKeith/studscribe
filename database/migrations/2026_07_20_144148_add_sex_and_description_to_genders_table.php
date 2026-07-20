<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('genders', function (Blueprint $table) {
            // Biological sex the term applies to -- e.g. Mare/Filly are
            // female, Stallion/Colt/Gelding are male. Separate from
            // `horses.sex`, which is the horse's own binary.
            $table->enum('sex', ['male', 'female'])->nullable()->after('name');
            $table->text('description')->nullable()->after('sex');
        });
    }

    public function down(): void
    {
        Schema::table('genders', function (Blueprint $table) {
            $table->dropColumn(['sex', 'description']);
        });
    }
};
