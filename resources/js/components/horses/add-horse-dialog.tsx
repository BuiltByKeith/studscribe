import { FormField, FormSection } from '@/components/form-field';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type HorseFormOptions } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { useState } from 'react';

/** Radix Select cannot hold an empty-string value, so "none" stands in for null. */
const NONE = 'none';

/**
 * Explicit members give each field its real type; the index signature keeps the
 * shape assignable to Inertia's form-data constraint.
 */
interface HorseFormData {
    [key: string]: string | File | null;
    horse_image: File | null;
    horse_name: string;
    registration_no: string;
    sex: string;
    gender_id: string;
    breed_id: string;
    supplier_id: string;
    color: string;
    birth_date: string;
    acquisition_date: string;
    retirement_date: string;
    sire: string;
    dam: string;
    sire_id: string;
    dam_id: string;
    parent_info: string;
    breed_percentage: string;
    description: string;
}

const INITIAL: HorseFormData = {
    horse_image: null,
    horse_name: '',
    registration_no: '',
    sex: NONE,
    gender_id: NONE,
    breed_id: NONE,
    supplier_id: NONE,
    color: '',
    birth_date: '',
    acquisition_date: '',
    retirement_date: '',
    sire: '',
    dam: '',
    sire_id: NONE,
    dam_id: NONE,
    parent_info: '',
    breed_percentage: '',
    description: '',
};

/** Turns the sentinel and blank strings back into nulls for the API. */
function clean(value: string): string | null {
    return value === NONE || value.trim() === '' ? null : value;
}

export function AddHorseDialog({ options }: { options: HorseFormOptions }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm(INITIAL);

    // `horse_image` is deliberately passed through untouched -- it is a File,
    // and Inertia switches to multipart automatically when it sees one.
    transform((form) => ({
        ...form,
        registration_no: clean(form.registration_no),
        sex: clean(form.sex),
        gender_id: clean(form.gender_id),
        breed_id: clean(form.breed_id),
        supplier_id: clean(form.supplier_id),
        color: clean(form.color),
        birth_date: clean(form.birth_date),
        acquisition_date: clean(form.acquisition_date),
        retirement_date: clean(form.retirement_date),
        sire: clean(form.sire),
        dam: clean(form.dam),
        sire_id: clean(form.sire_id),
        dam_id: clean(form.dam_id),
        parent_info: clean(form.parent_info),
        breed_percentage: clean(form.breed_percentage),
        description: clean(form.description),
    }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        // Discard a half-filled form on dismissal so reopening starts clean
        // rather than resurrecting the last abandoned attempt.
        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('horses.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Horse
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a horse</DialogTitle>
                        <DialogDescription>Only the name is required. Everything else can be filled in later.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <FormSection title="Photo">
                            <FormField id="horse_image" label="Horse photo" error={errors.horse_image}>
                                <ImageUpload id="horse_image" disabled={processing} onChange={(file) => setData('horse_image', file)} />
                            </FormField>
                        </FormSection>

                        <FormSection title="Identity">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="horse_name" label="Horse name" required error={errors.horse_name} className="sm:col-span-2">
                                    <Input
                                        id="horse_name"
                                        value={data.horse_name}
                                        onChange={(e) => setData('horse_name', e.target.value)}
                                        placeholder="Midnight Runner"
                                        autoFocus
                                    />
                                </FormField>

                                <FormField
                                    id="registration_no"
                                    label="Registration number"
                                    error={errors.registration_no}
                                    hint="blank if unregistered"
                                >
                                    <Input
                                        id="registration_no"
                                        value={data.registration_no}
                                        onChange={(e) => setData('registration_no', e.target.value)}
                                        placeholder="AB-1234-567"
                                    />
                                </FormField>

                                <FormField id="color" label="Colour" error={errors.color}>
                                    <Input
                                        id="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="Bay"
                                    />
                                </FormField>

                                <FormField id="sex" label="Sex" error={errors.sex}>
                                    <Select value={data.sex} onValueChange={(value) => setData('sex', value)}>
                                        <SelectTrigger id="sex">
                                            <SelectValue placeholder="Select sex" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not specified</SelectItem>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField id="gender_id" label="Gender" error={errors.gender_id} hint="stallion, mare, gelding">
                                    <Select value={data.gender_id} onValueChange={(value) => setData('gender_id', value)}>
                                        <SelectTrigger id="gender_id">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not specified</SelectItem>
                                            {options.genders.map((gender) => (
                                                <SelectItem key={gender.id} value={String(gender.id)}>
                                                    {gender.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Breeding">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="breed_id" label="Breed" error={errors.breed_id}>
                                    <Select value={data.breed_id} onValueChange={(value) => setData('breed_id', value)}>
                                        <SelectTrigger id="breed_id">
                                            <SelectValue placeholder="Select breed" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not specified</SelectItem>
                                            {options.breeds.map((breed) => (
                                                <SelectItem key={breed.id} value={String(breed.id)}>
                                                    {breed.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField id="breed_percentage" label="Breed percentage" error={errors.breed_percentage} hint="0-100">
                                    <div className="relative">
                                        <Input
                                            id="breed_percentage"
                                            type="number"
                                            inputMode="decimal"
                                            min={0}
                                            max={100}
                                            step="0.01"
                                            value={data.breed_percentage}
                                            onChange={(e) => setData('breed_percentage', e.target.value)}
                                            placeholder="100"
                                            className="pr-8"
                                        />
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                            %
                                        </span>
                                    </div>
                                </FormField>

                                {/* Pick the parent's own record when it is a
                                    horse here -- that is what makes the pedigree
                                    tree traversable. Otherwise fall back to a
                                    plain name. */}
                                <FormField id="sire_id" label="Sire" error={errors.sire_id ?? errors.sire} hint="father">
                                    <Select
                                        value={data.sire_id}
                                        onValueChange={(value) => {
                                            setData('sire_id', value);

                                            if (value !== NONE) {
                                                setData('sire', '');
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="sire_id">
                                            <SelectValue placeholder="Select sire" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not on this farm</SelectItem>
                                            {options.sires.map((sire) => (
                                                <SelectItem key={sire.id} value={String(sire.id)}>
                                                    {sire.horse_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField id="dam_id" label="Dam" error={errors.dam_id ?? errors.dam} hint="mother">
                                    <Select
                                        value={data.dam_id}
                                        onValueChange={(value) => {
                                            setData('dam_id', value);

                                            if (value !== NONE) {
                                                setData('dam', '');
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="dam_id">
                                            <SelectValue placeholder="Select dam" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not on this farm</SelectItem>
                                            {options.dams.map((dam) => (
                                                <SelectItem key={dam.id} value={String(dam.id)}>
                                                    {dam.horse_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                {data.sire_id === NONE && (
                                    <FormField id="sire" label="Sire name" error={errors.sire} hint="if not on this farm">
                                        <Input
                                            id="sire"
                                            value={data.sire}
                                            onChange={(e) => setData('sire', e.target.value)}
                                            placeholder="Thunder Blaze"
                                        />
                                    </FormField>
                                )}

                                {data.dam_id === NONE && (
                                    <FormField id="dam" label="Dam name" error={errors.dam} hint="if not on this farm">
                                        <Input id="dam" value={data.dam} onChange={(e) => setData('dam', e.target.value)} placeholder="Silver Song" />
                                    </FormField>
                                )}

                                <FormField id="parent_info" label="Pedigree notes" error={errors.parent_info} className="sm:col-span-2">
                                    <textarea
                                        id="parent_info"
                                        rows={2}
                                        value={data.parent_info}
                                        onChange={(e) => setData('parent_info', e.target.value)}
                                        placeholder="Bloodline details, registrations, lineage notes."
                                        className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Acquisition">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="supplier_id" label="Supplier" error={errors.supplier_id}>
                                    <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                        <SelectTrigger id="supplier_id">
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not specified</SelectItem>
                                            {options.suppliers.map((supplier) => (
                                                <SelectItem key={supplier.id} value={String(supplier.id)}>
                                                    {supplier.supplier_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField id="birth_date" label="Date of birth" error={errors.birth_date}>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                </FormField>

                                <FormField id="acquisition_date" label="Acquisition date" error={errors.acquisition_date}>
                                    <Input
                                        id="acquisition_date"
                                        type="date"
                                        value={data.acquisition_date}
                                        onChange={(e) => setData('acquisition_date', e.target.value)}
                                    />
                                </FormField>

                                <FormField id="retirement_date" label="Retirement date" error={errors.retirement_date} hint="blank if active">
                                    <Input
                                        id="retirement_date"
                                        type="date"
                                        value={data.retirement_date}
                                        onChange={(e) => setData('retirement_date', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Notes">
                            <FormField id="description" label="Description" error={errors.description}>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Temperament, training history, anything worth remembering."
                                    className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                                />
                            </FormField>
                        </FormSection>
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add horse
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
