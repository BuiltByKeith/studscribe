import { FormField, FormSection } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type HorseOption, type UserOption, type VaccinationRow, type VaccineOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

/** Radix Select cannot hold an empty-string value, so "none" stands in for null. */
const NONE = 'none';

interface VaccinationFormData {
    [key: string]: string;
    horse_id: string;
    vaccine_id: string;
    date_administered: string;
    next_due_date: string;
    administered_by: string;
    dosage: string;
    notes: string;
}

const INITIAL: VaccinationFormData = {
    horse_id: '',
    vaccine_id: '',
    date_administered: '',
    next_due_date: '',
    administered_by: NONE,
    dosage: '',
    notes: '',
};

function clean(value: string): string | null {
    return value === NONE || value.trim() === '' ? null : value;
}

interface Options {
    horses: HorseOption[];
    vaccines: VaccineOption[];
    users: UserOption[];
}

function VaccinationFields({
    data,
    setData,
    errors,
    options,
}: {
    data: VaccinationFormData;
    setData: (key: keyof VaccinationFormData, value: string) => void;
    errors: Partial<Record<keyof VaccinationFormData, string>>;
    options: Options;
}) {
    return (
        <>
            <FormSection title="Horse & Vaccine">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="horse_id" label="Horse" required error={errors.horse_id}>
                        <Select value={data.horse_id} onValueChange={(value) => setData('horse_id', value)}>
                            <SelectTrigger id="horse_id">
                                <SelectValue placeholder="Select horse" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.horses.map((horse) => (
                                    <SelectItem key={horse.id} value={String(horse.id)}>
                                        {horse.horse_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField id="vaccine_id" label="Vaccine" required error={errors.vaccine_id}>
                        <Select value={data.vaccine_id} onValueChange={(value) => setData('vaccine_id', value)}>
                            <SelectTrigger id="vaccine_id">
                                <SelectValue placeholder="Select vaccine" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.vaccines.map((vaccine) => (
                                    <SelectItem key={vaccine.id} value={String(vaccine.id)}>
                                        {vaccine.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Schedule">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="date_administered" label="Date administered" required error={errors.date_administered}>
                        <Input
                            id="date_administered"
                            type="date"
                            value={data.date_administered}
                            onChange={(e) => setData('date_administered', e.target.value)}
                        />
                    </FormField>

                    <FormField id="next_due_date" label="Next due date" error={errors.next_due_date} hint="for the next booster">
                        <Input
                            id="next_due_date"
                            type="date"
                            value={data.next_due_date}
                            onChange={(e) => setData('next_due_date', e.target.value)}
                        />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Details">
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="dosage" label="Dosage" error={errors.dosage}>
                            <Input id="dosage" value={data.dosage} onChange={(e) => setData('dosage', e.target.value)} placeholder="1 mL" />
                        </FormField>

                        <FormField id="administered_by" label="Administered by" error={errors.administered_by}>
                            <Select value={data.administered_by} onValueChange={(value) => setData('administered_by', value)}>
                                <SelectTrigger id="administered_by">
                                    <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NONE}>Not specified</SelectItem>
                                    {options.users.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <FormField id="notes" label="Notes" error={errors.notes}>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Reaction, batch number, anything worth remembering."
                            className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                        />
                    </FormField>
                </div>
            </FormSection>
        </>
    );
}

export function AddVaccinationDialog({ options }: { options: Options }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<VaccinationFormData>(INITIAL);

    transform((form) => ({
        ...form,
        next_due_date: clean(form.next_due_date),
        administered_by: clean(form.administered_by),
        dosage: clean(form.dosage),
        notes: clean(form.notes),
    }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('vaccinations.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Vaccination
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Record a vaccination</DialogTitle>
                        <DialogDescription>Horse, vaccine, and administration date are required.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <VaccinationFields data={data} setData={setData} errors={errors} options={options} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add vaccination
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditVaccinationDialog({ vaccination, options }: { vaccination: VaccinationRow; options: Options }) {
    const [open, setOpen] = useState(false);

    const initial = (): VaccinationFormData => ({
        horse_id: String(vaccination.horse_id),
        vaccine_id: String(vaccination.vaccine_id),
        date_administered: vaccination.date_administered ?? '',
        next_due_date: vaccination.next_due_date ?? '',
        administered_by: vaccination.administered_by_id !== null ? String(vaccination.administered_by_id) : NONE,
        dosage: vaccination.dosage ?? '',
        notes: vaccination.notes ?? '',
    });

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<VaccinationFormData>(initial());

    transform((form) => ({
        ...form,
        next_due_date: clean(form.next_due_date),
        administered_by: clean(form.administered_by),
        dosage: clean(form.dosage),
        notes: clean(form.notes),
    }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData(initial());
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('vaccinations.update', vaccination.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit vaccination for ${vaccination.horse_name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit vaccination</DialogTitle>
                        <DialogDescription>Update this record for {vaccination.horse_name}.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <VaccinationFields data={data} setData={setData} errors={errors} options={options} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
