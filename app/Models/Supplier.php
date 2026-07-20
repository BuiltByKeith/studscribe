<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\SupplierFactory> */
    use HasFactory;

    protected $fillable = [
        'supplier_name',
        'address',
        'contact',
        'status',
    ];

    /**
     * Horses acquired from this supplier.
     *
     * @return HasMany<Horse, $this>
     */
    public function horses(): HasMany
    {
        return $this->hasMany(Horse::class);
    }
}
