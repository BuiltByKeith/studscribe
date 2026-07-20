<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Breed extends Model
{
    /** @use HasFactory<\Database\Factories\BreedFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Horses of this breed.
     *
     * @return HasMany<Horse, $this>
     */
    public function horses(): HasMany
    {
        return $this->hasMany(Horse::class);
    }
}
