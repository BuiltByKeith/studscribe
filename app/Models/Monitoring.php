<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Monitoring extends Model
{
    /** @use HasFactory<\Database\Factories\MonitoringFactory> */
    use HasFactory;

    protected $fillable = [
        'horse_id',
        'monitoring_date',
        'height',
        'weight',
        'temperature',
        'heart_rate',
        'respiratory_rate',
        'condition_score',
        'notes',
        'checked_by',
    ];

    protected function casts(): array
    {
        return [
            'monitoring_date' => 'date',
            'height' => 'decimal:2',
            'weight' => 'decimal:2',
            'temperature' => 'decimal:1',
            'heart_rate' => 'integer',
            'respiratory_rate' => 'integer',
            'condition_score' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Horse, $this>
     */
    public function horse(): BelongsTo
    {
        return $this->belongsTo(Horse::class);
    }

    /**
     * The staff member who recorded this reading.
     *
     * @return BelongsTo<User, $this>
     */
    public function checkedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_by');
    }
}
