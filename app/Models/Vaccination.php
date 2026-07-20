<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccination extends Model
{
    /** @use HasFactory<\Database\Factories\VaccinationFactory> */
    use HasFactory;

    protected $fillable = [
        'horse_id',
        'vaccine_id',
        'date_administered',
        'next_due_date',
        'administered_by',
        'dosage',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_administered' => 'date',
            'next_due_date' => 'date',
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
     * @return BelongsTo<Vaccine, $this>
     */
    public function vaccine(): BelongsTo
    {
        return $this->belongsTo(Vaccine::class);
    }

    /**
     * The staff member who administered the dose.
     *
     * @return BelongsTo<User, $this>
     */
    public function administeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'administered_by');
    }

    /**
     * Whether the next dose is overdue as of today.
     */
    public function isOverdue(): bool
    {
        return $this->next_due_date !== null && $this->next_due_date->isPast();
    }
}
