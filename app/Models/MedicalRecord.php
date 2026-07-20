<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    /** @use HasFactory<\Database\Factories\MedicalRecordFactory> */
    use HasFactory;

    protected $fillable = [
        'horse_id',
        'visit_date',
        'diagnosis',
        'treatment',
        'veterinarian',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Horse, $this>
     */
    public function horse(): BelongsTo
    {
        return $this->belongsTo(Horse::class);
    }
}
