<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vaccine extends Model
{
    /** @use HasFactory<\Database\Factories\VaccineFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'manufacturer',
        'dose',
        'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    /**
     * Administration records for this vaccine.
     *
     * Note the restrict rule on `vaccinations.vaccine_id`: a vaccine that has
     * been administered cannot be deleted, because doing so would erase medical
     * history. Deactivate it instead.
     *
     * @return HasMany<Vaccination, $this>
     */
    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }
}
