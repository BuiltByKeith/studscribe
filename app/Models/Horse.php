<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Horse extends Model
{
    /** @use HasFactory<\Database\Factories\HorseFactory> */
    use HasFactory;

    protected $fillable = [
        'horse_name',
        'registration_no',
        'sex',
        'sire_id',
        'dam_id',
        'gender_id',
        'breed_id',
        'supplier_id',
        'color',
        'birth_date',
        'acquisition_date',
        'retirement_date',
        'description',
        'sire',
        'dam',
        'parent_info',
        'breed_percentage',
        'horse_image',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'acquisition_date' => 'date',
            'retirement_date' => 'date',
            'breed_percentage' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Breed, $this>
     */
    public function breed(): BelongsTo
    {
        return $this->belongsTo(Breed::class);
    }

    /**
     * @return BelongsTo<Gender, $this>
     */
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class);
    }

    /**
     * @return BelongsTo<Supplier, $this>
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * @return HasMany<Monitoring, $this>
     */
    public function monitorings(): HasMany
    {
        return $this->hasMany(Monitoring::class);
    }

    /**
     * @return HasMany<MedicalRecord, $this>
     */
    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    /**
     * @return HasMany<Vaccination, $this>
     */
    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    /**
     * The most recent monitoring reading.
     *
     * Defined as a relation rather than a scope so it can be eager-loaded --
     * `Horse::with('latestMonitoring')` stays one query across any number of
     * horses, which a per-horse query in the view would not.
     *
     * @return HasOne<Monitoring, $this>
     */
    public function latestMonitoring(): HasOne
    {
        return $this->hasOne(Monitoring::class)->latestOfMany('monitoring_date');
    }

    /**
     * The sire's own record, when the father is a horse on this farm.
     *
     * @return BelongsTo<Horse, $this>
     */
    public function sireHorse(): BelongsTo
    {
        return $this->belongsTo(Horse::class, 'sire_id');
    }

    /**
     * The dam's own record, when the mother is a horse on this farm.
     *
     * @return BelongsTo<Horse, $this>
     */
    public function damHorse(): BelongsTo
    {
        return $this->belongsTo(Horse::class, 'dam_id');
    }

    /**
     * Horses sired by this one.
     *
     * @return HasMany<Horse, $this>
     */
    public function sireOffspring(): HasMany
    {
        return $this->hasMany(Horse::class, 'sire_id');
    }

    /**
     * Horses born to this one.
     *
     * @return HasMany<Horse, $this>
     */
    public function damOffspring(): HasMany
    {
        return $this->hasMany(Horse::class, 'dam_id');
    }

    /**
     * Every horse with this one as either parent.
     *
     * A single query over both columns -- merging two relations in PHP would
     * need de-duplication, since a horse can appear under both when its parents
     * are the same animal recorded twice.
     *
     * @return \Illuminate\Database\Eloquent\Builder<Horse>
     */
    public function offspring(): Builder
    {
        return static::query()
            ->where(fn (Builder $query) => $query->where('sire_id', $this->id)->orWhere('dam_id', $this->id));
    }

    /**
     * Horses sharing at least one parent with this one.
     *
     * Half-siblings count: sharing a single parent is still a sibling
     * relationship, and on a stud farm it is the common case.
     *
     * @return \Illuminate\Database\Eloquent\Builder<Horse>
     */
    public function siblings(): Builder
    {
        return static::query()
            ->whereKeyNot($this->id)
            ->where(function (Builder $query) {
                if ($this->sire_id) {
                    $query->orWhere('sire_id', $this->sire_id);
                }

                if ($this->dam_id) {
                    $query->orWhere('dam_id', $this->dam_id);
                }

                // No known parents means no derivable siblings; this keeps the
                // query from matching every horse with a null parent.
                if (! $this->sire_id && ! $this->dam_id) {
                    $query->whereRaw('1 = 0');
                }
            });
    }

    /**
     * Public URL for the horse's photo, or null if none was uploaded.
     *
     * Derived rather than stored so the rows stay valid if the disk, bucket, or
     * domain changes -- only the relative path lives in the database.
     */
    public function imageUrl(): ?string
    {
        return $this->horse_image ? Storage::disk('public')->url($this->horse_image) : null;
    }

    /**
     * Whether the horse has been retired as of today.
     */
    public function isRetired(): bool
    {
        return $this->retirement_date !== null && $this->retirement_date->isPast();
    }
}
