<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gender extends Model
{
    /** @use HasFactory<\Database\Factories\GenderFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'sex',
        'description',
    ];

    /**
     * Horses carrying this gender designation.
     *
     * @return HasMany<Horse, $this>
     */
    public function horses(): HasMany
    {
        return $this->hasMany(Horse::class);
    }
}
