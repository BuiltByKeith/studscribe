<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHorseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // The only column the schema requires.
            'horse_name' => ['required', 'string', 'max:255'],

            // Unique but nullable -- MySQL allows many NULLs in a unique index,
            // which is what lets unregistered horses coexist.
            'registration_no' => ['nullable', 'string', 'max:255', Rule::unique('horses', 'registration_no')],

            'sex' => ['nullable', Rule::in(['male', 'female'])],
            'gender_id' => ['nullable', 'integer', Rule::exists('genders', 'id')],
            'breed_id' => ['nullable', 'integer', Rule::exists('breeds', 'id')],
            'supplier_id' => ['nullable', 'integer', Rule::exists('suppliers', 'id')],

            'color' => ['nullable', 'string', 'max:255'],

            // A horse cannot be born in the future, acquired before it existed,
            // or retired before it arrived.
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'acquisition_date' => ['nullable', 'date', 'before_or_equal:today', 'after_or_equal:birth_date'],
            'retirement_date' => ['nullable', 'date', 'after_or_equal:acquisition_date'],

            // Text names for ancestors that are not records here, and optional
            // links for the ones that are. A horse cannot be its own parent --
            // but since it has no id yet at create time, that check only
            // becomes meaningful on update.
            'sire' => ['nullable', 'string', 'max:255'],
            'dam' => ['nullable', 'string', 'max:255'],
            'sire_id' => ['nullable', 'integer', Rule::exists('horses', 'id')],
            'dam_id' => ['nullable', 'integer', Rule::exists('horses', 'id')],
            'parent_info' => ['nullable', 'string', 'max:2000'],

            // The column holds decimal(5,2), but a breed share above 100 is
            // meaningless, so the real bound is enforced here.
            'breed_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],

            'description' => ['nullable', 'string', 'max:2000'],

            // The client compresses before upload, but that is a convenience,
            // not a control -- anyone can post directly to this endpoint. These
            // rules are the actual boundary.
            //
            // `image` inspects the file rather than trusting its name, `mimes`
            // pins the accepted formats, and `dimensions` caps pixel count so a
            // small file cannot expand into gigabytes of memory when decoded.
            'horse_image' => [
                'nullable',
                'file',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
                'dimensions:max_width=8000,max_height=8000',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'acquisition_date.after_or_equal' => 'The acquisition date cannot be before the horse was born.',
            'retirement_date.after_or_equal' => 'The retirement date cannot be before the horse was acquired.',
            'breed_percentage.max' => 'Breed percentage cannot exceed 100%.',
            'registration_no.unique' => 'Another horse is already registered under this number.',
            'horse_image.image' => 'The uploaded file is not a valid image.',
            'horse_image.mimes' => 'Photos must be JPEG, PNG, or WebP.',
            'horse_image.max' => 'Photos must be 5 MB or smaller.',
            'horse_image.dimensions' => 'That image is too large in pixel dimensions.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'horse_name' => 'horse name',
            'registration_no' => 'registration number',
            'gender_id' => 'gender',
            'breed_id' => 'breed',
            'supplier_id' => 'supplier',
            'breed_percentage' => 'breed percentage',
        ];
    }
}
