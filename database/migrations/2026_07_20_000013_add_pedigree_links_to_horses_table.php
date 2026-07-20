<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Self-referencing pedigree links.
     *
     * The existing `sire` / `dam` text columns stay: most ancestors are not
     * themselves records on this farm, and a name is still worth keeping when
     * there is nothing to point at. The FKs are the machine-readable half --
     * they are what make grandparents, siblings, and offspring derivable.
     *
     * nullOnDelete rather than cascade: deleting a parent must not delete its
     * descendants, only sever the link.
     */
    public function up(): void
    {
        Schema::table('horses', function (Blueprint $table) {
            $table->foreignId('sire_id')->nullable()->after('sex')->constrained('horses')->nullOnDelete();
            $table->foreignId('dam_id')->nullable()->after('sire_id')->constrained('horses')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('horses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sire_id');
            $table->dropConstrainedForeignId('dam_id');
        });
    }
};
