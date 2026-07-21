import { FormField, FormSection } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreedingRecordFormOptions, type BreedingRecordRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface BreedingRecordFormData {
    [key: string]: string;
    stallion_id: string;
    mare_id: string;
    last_breeding_date: string;
    cycle_1_date: string;
    cycle_1_day21_date: string;
    cycle_1_notes: string;
    cycle_2_date: string;
    cycle_2_day21_date: string;
    cycle_2_notes: string;
    cycle_3_date: string;
    cycle_3_day21_date: string;
    cycle_3_notes: string;
    cycle_4_date: string;
    cycle_4_notes: string;
}

const INITIAL: BreedingRecordFormData = {
    stallion_id: '',
    mare_id: '',
    last_breeding_date: '',
    cycle_1_date: '',
    cycle_1_day21_date: '',
    cycle_1_notes: '',
    cycle_2_date: '',
    cycle_2_day21_date: '',
    cycle_2_notes: '',
    cycle_3_date: '',
    cycle_3_day21_date: '',
    cycle_3_notes: '',
    cycle_4_date: '',
    cycle_4_notes: '',
};

const NULLABLE_KEYS = [
    'cycle_1_date',
    'cycle_1_day21_date',
    'cycle_1_notes',
    'cycle_2_date',
    'cycle_2_day21_date',
    'cycle_2_notes',
    'cycle_3_date',
    'cycle_3_day21_date',
    'cycle_3_notes',
    'cycle_4_date',
    'cycle_4_notes',
] as const;

function clean(value: string): string | null {
    return value.trim() === '' ? null : value;
}

function transformPayload(form: BreedingRecordFormData) {
    const payload: Record<string, string | null> = { ...form };

    for (const key of NULLABLE_KEYS) {
        payload[key] = clean(form[key]);
    }

    return payload;
}

function CycleSection({
    cycleNumber,
    data,
    setData,
    errors,
    hasDay21,
}: {
    cycleNumber: 1 | 2 | 3 | 4;
    data: BreedingRecordFormData;
    setData: (key: keyof BreedingRecordFormData, value: string) => void;
    errors: Partial<Record<keyof BreedingRecordFormData, string>>;
    hasDay21: boolean;
}) {
    const dateKey = `cycle_${cycleNumber}_date` as const;
    const day21Key = `cycle_${cycleNumber}_day21_date` as const;
    const notesKey = `cycle_${cycleNumber}_notes` as const;
    const ordinal = ['1st', '2nd', '3rd', '4th'][cycleNumber - 1];

    return (
        <FormSection title={`${ordinal} Cycle`}>
            <div className={`grid gap-4 ${hasDay21 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
                <FormField id={dateKey} label={`${ordinal} cycle date`} error={errors[dateKey]}>
                    <Input id={dateKey} type="date" value={data[dateKey]} onChange={(e) => setData(dateKey, e.target.value)} />
                </FormField>

                {hasDay21 && (
                    <FormField id={day21Key} label="21st day" error={errors[day21Key]}>
                        <Input id={day21Key} type="date" value={data[day21Key]} onChange={(e) => setData(day21Key, e.target.value)} />
                    </FormField>
                )}
            </div>

            <FormField id={notesKey} label={`${ordinal} cycle notes`} error={errors[notesKey]} className="mt-4">
                <textarea
                    id={notesKey}
                    rows={2}
                    value={data[notesKey]}
                    onChange={(e) => setData(notesKey, e.target.value)}
                    placeholder="Anything worth noting for this cycle."
                    className="border-input bg-surface text-foreground shadow-subtle placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-ring/25 flex w-full rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                />
            </FormField>
        </FormSection>
    );
}

function BreedingRecordFields({
    data,
    setData,
    errors,
    options,
}: {
    data: BreedingRecordFormData;
    setData: (key: keyof BreedingRecordFormData, value: string) => void;
    errors: Partial<Record<keyof BreedingRecordFormData, string>>;
    options: BreedingRecordFormOptions;
}) {
    return (
        <>
            <FormSection title="Pair & Last Breeding">
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField id="stallion_id" label="Stallion" required error={errors.stallion_id}>
                        <Select value={data.stallion_id} onValueChange={(value) => setData('stallion_id', value)}>
                            <SelectTrigger id="stallion_id">
                                <SelectValue placeholder="Select stallion" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.stallions.map((horse) => (
                                    <SelectItem key={horse.id} value={String(horse.id)}>
                                        {horse.horse_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField id="mare_id" label="Mare" required error={errors.mare_id}>
                        <Select value={data.mare_id} onValueChange={(value) => setData('mare_id', value)}>
                            <SelectTrigger id="mare_id">
                                <SelectValue placeholder="Select mare" />
                            </SelectTrigger>
                            <SelectContent>
                                {options.mares.map((horse) => (
                                    <SelectItem key={horse.id} value={String(horse.id)}>
                                        {horse.horse_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField
                        id="last_breeding_date"
                        label="Last breeding date"
                        required
                        error={errors.last_breeding_date}
                        hint="first mate date until a cycle is recorded"
                        className="sm:col-span-2"
                    >
                        <Input
                            id="last_breeding_date"
                            type="date"
                            value={data.last_breeding_date}
                            onChange={(e) => setData('last_breeding_date', e.target.value)}
                        />
                    </FormField>
                </div>
            </FormSection>

            <CycleSection cycleNumber={1} data={data} setData={setData} errors={errors} hasDay21 />
            <CycleSection cycleNumber={2} data={data} setData={setData} errors={errors} hasDay21 />
            <CycleSection cycleNumber={3} data={data} setData={setData} errors={errors} hasDay21 />
            <CycleSection cycleNumber={4} data={data} setData={setData} errors={errors} hasDay21={false} />
        </>
    );
}

export function AddBreedingRecordDialog({ options }: { options: BreedingRecordFormOptions }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<BreedingRecordFormData>(INITIAL);

    transform((form) => transformPayload(form));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('breeding-records.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Breeding Record
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Add a breeding record</DialogTitle>
                        <DialogDescription>
                            Stallion, mare, and last breeding date are required. Cycles can be filled in as they happen.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <BreedingRecordFields data={data} setData={setData} errors={errors} options={options} />
                    </DialogBody>

                    <DialogFooter className="border-border border-t">
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

export function EditBreedingRecordDialog({ record, options }: { record: BreedingRecordRow; options: BreedingRecordFormOptions }) {
    const [open, setOpen] = useState(false);

    const initial = (): BreedingRecordFormData => ({
        stallion_id: String(record.stallion_id),
        mare_id: String(record.mare_id),
        last_breeding_date: record.last_breeding_date ?? '',
        cycle_1_date: record.cycle_1_date ?? '',
        cycle_1_day21_date: record.cycle_1_day21_date ?? '',
        cycle_1_notes: record.cycle_1_notes ?? '',
        cycle_2_date: record.cycle_2_date ?? '',
        cycle_2_day21_date: record.cycle_2_day21_date ?? '',
        cycle_2_notes: record.cycle_2_notes ?? '',
        cycle_3_date: record.cycle_3_date ?? '',
        cycle_3_day21_date: record.cycle_3_day21_date ?? '',
        cycle_3_notes: record.cycle_3_notes ?? '',
        cycle_4_date: record.cycle_4_date ?? '',
        cycle_4_notes: record.cycle_4_notes ?? '',
    });

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<BreedingRecordFormData>(initial());

    transform((form) => transformPayload(form));

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

        put(route('breeding-records.update', record.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    aria-label={`Edit breeding record for ${record.stallion_name ?? 'stallion'} and ${record.mare_name ?? 'mare'}`}
                >
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Edit breeding record</DialogTitle>
                        <DialogDescription>
                            Update the pairing for {record.stallion_name} and {record.mare_name}. Add the next cycle date and leave a note as needed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <BreedingRecordFields data={data} setData={setData} errors={errors} options={options} />
                    </DialogBody>

                    <DialogFooter className="border-border border-t">
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
