import { FormField, FormSection } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type HorseOption, type MedicalRecordRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface MedicalRecordFormData {
    [key: string]: string;
    horse_id: string;
    visit_date: string;
    diagnosis: string;
    treatment: string;
    veterinarian: string;
    notes: string;
}

const INITIAL: MedicalRecordFormData = {
    horse_id: '',
    visit_date: '',
    diagnosis: '',
    treatment: '',
    veterinarian: '',
    notes: '',
};

function clean(value: string): string | null {
    return value.trim() === '' ? null : value;
}

const TEXTAREA_CLASS =
    'flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden';

function MedicalRecordFields({
    data,
    setData,
    errors,
    horses,
}: {
    data: MedicalRecordFormData;
    setData: (key: keyof MedicalRecordFormData, value: string) => void;
    errors: Partial<Record<keyof MedicalRecordFormData, string>>;
    horses: HorseOption[];
}) {
    return (
        <>
            <FormSection title="Horse & Visit">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="horse_id" label="Horse" required error={errors.horse_id}>
                        <Select value={data.horse_id} onValueChange={(value) => setData('horse_id', value)}>
                            <SelectTrigger id="horse_id">
                                <SelectValue placeholder="Select horse" />
                            </SelectTrigger>
                            <SelectContent>
                                {horses.map((horse) => (
                                    <SelectItem key={horse.id} value={String(horse.id)}>
                                        {horse.horse_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField id="visit_date" label="Date of visit" required error={errors.visit_date}>
                        <Input id="visit_date" type="date" value={data.visit_date} onChange={(e) => setData('visit_date', e.target.value)} />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Findings">
                <div className="space-y-4">
                    <FormField id="diagnosis" label="Diagnosis" error={errors.diagnosis}>
                        <textarea
                            id="diagnosis"
                            rows={3}
                            value={data.diagnosis}
                            onChange={(e) => setData('diagnosis', e.target.value)}
                            placeholder="What the veterinarian found."
                            className={TEXTAREA_CLASS}
                        />
                    </FormField>

                    <FormField id="treatment" label="Treatment" error={errors.treatment}>
                        <textarea
                            id="treatment"
                            rows={3}
                            value={data.treatment}
                            onChange={(e) => setData('treatment', e.target.value)}
                            placeholder="What was prescribed or performed."
                            className={TEXTAREA_CLASS}
                        />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Veterinarian & Notes">
                <div className="space-y-4">
                    <FormField id="veterinarian" label="Veterinarian" error={errors.veterinarian}>
                        <Input
                            id="veterinarian"
                            value={data.veterinarian}
                            onChange={(e) => setData('veterinarian', e.target.value)}
                            placeholder="Dr. Santos"
                        />
                    </FormField>

                    <FormField id="notes" label="Notes" error={errors.notes}>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Follow-up care, anything worth remembering."
                            className={TEXTAREA_CLASS}
                        />
                    </FormField>
                </div>
            </FormSection>
        </>
    );
}

export function AddMedicalRecordDialog({ horses }: { horses: HorseOption[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<MedicalRecordFormData>(INITIAL);

    transform((form) => ({
        ...form,
        diagnosis: clean(form.diagnosis),
        treatment: clean(form.treatment),
        veterinarian: clean(form.veterinarian),
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

        post(route('medical-records.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Medical Record
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a medical record</DialogTitle>
                        <DialogDescription>Horse and visit date are required.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <MedicalRecordFields data={data} setData={setData} errors={errors} horses={horses} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditMedicalRecordDialog({ record, horses }: { record: MedicalRecordRow; horses: HorseOption[] }) {
    const [open, setOpen] = useState(false);

    const initial = (): MedicalRecordFormData => ({
        horse_id: String(record.horse_id),
        visit_date: record.visit_date ?? '',
        diagnosis: record.diagnosis ?? '',
        treatment: record.treatment ?? '',
        veterinarian: record.veterinarian ?? '',
        notes: record.notes ?? '',
    });

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<MedicalRecordFormData>(initial());

    transform((form) => ({
        ...form,
        diagnosis: clean(form.diagnosis),
        treatment: clean(form.treatment),
        veterinarian: clean(form.veterinarian),
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

        put(route('medical-records.update', record.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit medical record for ${record.horse_name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit medical record</DialogTitle>
                        <DialogDescription>Update this visit for {record.horse_name}.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <MedicalRecordFields data={data} setData={setData} errors={errors} horses={horses} />
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
