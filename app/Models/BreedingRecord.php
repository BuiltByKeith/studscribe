<?php

namespace App\Models;

use Database\Factories\BreedingRecordFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BreedingRecord extends Model
{
    /** @use HasFactory<BreedingRecordFactory> */
    use HasFactory;

    protected $fillable = [
        'stallion_id',
        'mare_id',
        'last_breeding_date',
        'cycle_1_date',
        'cycle_1_day21_date',
        'cycle_1_notes',
        'cycle_2_date',
        'cycle_2_day21_date',
        'cycle_2_notes',
        'cycle_3_date',
        'cycle_3_day21_date',
        'cycle_3_notes',
        'cycle_4_date',
        'cycle_4_notes',
    ];

    protected function casts(): array
    {
        return [
            'last_breeding_date' => 'date',
            'cycle_1_date' => 'date',
            'cycle_1_day21_date' => 'date',
            'cycle_2_date' => 'date',
            'cycle_2_day21_date' => 'date',
            'cycle_3_date' => 'date',
            'cycle_3_day21_date' => 'date',
            'cycle_4_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Horse, $this>
     */
    public function stallion(): BelongsTo
    {
        return $this->belongsTo(Horse::class, 'stallion_id');
    }

    /**
     * @return BelongsTo<Horse, $this>
     */
    public function mare(): BelongsTo
    {
        return $this->belongsTo(Horse::class, 'mare_id');
    }
}
