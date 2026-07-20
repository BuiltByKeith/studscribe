<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horses', function (Blueprint $table) {
            $table->id();
            $table->string('horse_name');

            // Unique AND nullable: MySQL permits multiple NULLs in a unique
            // index, which is exactly right for unregistered horses.
            $table->string('registration_no')->nullable()->unique();

            // Biological binary. Closed set, never administered, so an enum
            // rather than a lookup table.
            $table->enum('sex', ['male', 'female'])->nullable();

            // Life-stage-and-status (Stallion, Mare, Gelding, ...) -- a
            // different fact from `sex`, and one the farm does administer.
            $table->foreignId('gender_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('breed_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();

            $table->string('color')->nullable();
            $table->date('birth_date')->nullable();
            $table->date('acquisition_date')->nullable();
            $table->date('retirement_date')->nullable();
            $table->text('description')->nullable();

            // Pedigree as free text: many ancestors are not in the system.
            // Self-referencing sire_id/dam_id is a deliberate open question.
            $table->string('sire')->nullable();
            $table->string('dam')->nullable();
            $table->text('parent_info')->nullable();
            $table->decimal('breed_percentage', 5, 2)->nullable();

            $table->string('horse_image')->nullable();
            $table->timestamps();

            // Carries the search path.
            $table->index('horse_name');
            $table->index('retirement_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horses');
    }
};
