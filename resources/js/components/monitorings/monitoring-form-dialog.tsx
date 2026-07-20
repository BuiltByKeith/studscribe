import { FormField, FormSection } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type HorseOption, type MonitoringRow, type UserOption } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

/** Radix Select cannot hold an empty-string value, so "none" stands in for null. */
const NONE = 'none';

interface MonitoringFormData {
    [key: string]: string;
    horse_id: string;
    monitoring_date: string;
    height: string;
    weight: string;
    temperature: string;
    heart_rate: string;
    respiratory_rate: string;
    condition_score: string;
    notes: string;
    checked_by: string;
}

const INITIAL: MonitoringFormData = {
    horse_id: '',
    monitoring_date: '',
    height: '',
    weight: '',
    temperature: '',
    heart_rate: '',
    respiratory_rate: '',
    condition_score: '',
    notes: '',
    checked_by: NONE,
};

function clean(value: string): string | null {
    return value === NONE || value.trim() === '' ? null : value;
}

interface Options {
    horses: HorseOption[];
    users: UserOption[];
}

function MonitoringFields({
    data,
    setData,
    errors,
    options,
}: {
    data: MonitoringFormData;
    setData: (key: keyof MonitoringFormData, value: string) => void;
    errors: Partial<Record<keyof MonitoringFormData, string>>;
    options: Options;
}) {
    return (
        <>
            <FormSection title="Horse & Date">
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

                    <FormField id="monitoring_date" label="Monitoring date" required error={errors.monitoring_date}>
                        <Input
                            id="monitoring_date"
                            type="date"
                            value={data.monitoring_date}
                            onChange={(e) => setData('monitoring_date', e.target.value)}
                        />
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Vital Signs">
                <div className="grid gap-4 sm:grid-cols-3">
                    <FormField id="height" label="Height" error={errors.height}>
                        <div className="relative">
                            <Input
                                id="height"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={data.height}
                                onChange={(e) => setData('height', e.target.value)}
                                className="pr-10"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                cm
                            </span>
                        </div>
                    </FormField>

                    <FormField id="weight" label="Weight" error={errors.weight}>
                        <div className="relative">
                            <Input
                                id="weight"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)}
                                className="pr-10"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                kg
                            </span>
                        </div>
                    </FormField>

                    <FormField id="temperature" label="Temperature" error={errors.temperature}>
                        <div className="relative">
                            <Input
                                id="temperature"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.1"
                                value={data.temperature}
                                onChange={(e) => setData('temperature', e.target.value)}
                                className="pr-10"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                °C
                            </span>
                        </div>
                    </FormField>

                    <FormField id="heart_rate" label="Heart rate" error={errors.heart_rate}>
                        <div className="relative">
                            <Input
                                id="heart_rate"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step="1"
                                value={data.heart_rate}
                                onChange={(e) => setData('heart_rate', e.target.value)}
                                className="pr-12"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                bpm
                            </span>
                        </div>
                    </FormField>

                    <FormField id="respiratory_rate" label="Respiratory rate" error={errors.respiratory_rate}>
                        <div className="relative">
                            <Input
                                id="respiratory_rate"
                                type="number"
                                inputMode="numeric"
                                min={0}
                                step="1"
                                value={data.respiratory_rate}
                                onChange={(e) => setData('respiratory_rate', e.target.value)}
                                className="pr-16"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                br/min
                            </span>
                        </div>
                    </FormField>

                    <FormField id="condition_score" label="Condition score" error={errors.condition_score} hint="1-10">
                        <div className="relative">
                            <Input
                                id="condition_score"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={10}
                                step="1"
                                value={data.condition_score}
                                onChange={(e) => setData('condition_score', e.target.value)}
                                className="pr-14"
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                /10
                            </span>
                        </div>
                    </FormField>
                </div>
            </FormSection>

            <FormSection title="Notes & Recorded By">
                <div className="space-y-4">
                    <FormField id="notes" label="Notes" error={errors.notes}>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Anything worth flagging about this reading."
                            className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                        />
                    </FormField>

                    <FormField id="checked_by" label="Checked by" error={errors.checked_by}>
                        <Select value={data.checked_by} onValueChange={(value) => setData('checked_by', value)}>
                            <SelectTrigger id="checked_by">
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
            </FormSection>
        </>
    );
}

export function AddMonitoringDialog({ options }: { options: Options }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<MonitoringFormData>(INITIAL);

    transform((form) => ({
        ...form,
        height: clean(form.height),
        weight: clean(form.weight),
        temperature: clean(form.temperature),
        heart_rate: clean(form.heart_rate),
        respiratory_rate: clean(form.respiratory_rate),
        condition_score: clean(form.condition_score),
        notes: clean(form.notes),
        checked_by: clean(form.checked_by),
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

        post(route('monitorings.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Reading
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a monitoring reading</DialogTitle>
                        <DialogDescription>Horse and date are required. Everything else can be filled in as available.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <MonitoringFields data={data} setData={setData} errors={errors} options={options} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add reading
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditMonitoringDialog({ monitoring, options }: { monitoring: MonitoringRow; options: Options }) {
    const [open, setOpen] = useState(false);

    const initial = (): MonitoringFormData => ({
        horse_id: String(monitoring.horse_id),
        monitoring_date: monitoring.monitoring_date ?? '',
        height: monitoring.height !== null ? String(monitoring.height) : '',
        weight: monitoring.weight !== null ? String(monitoring.weight) : '',
        temperature: monitoring.temperature !== null ? String(monitoring.temperature) : '',
        heart_rate: monitoring.heart_rate !== null ? String(monitoring.heart_rate) : '',
        respiratory_rate: monitoring.respiratory_rate !== null ? String(monitoring.respiratory_rate) : '',
        condition_score: monitoring.condition_score !== null ? String(monitoring.condition_score) : '',
        notes: monitoring.notes ?? '',
        checked_by: monitoring.checked_by_id !== null ? String(monitoring.checked_by_id) : NONE,
    });

    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<MonitoringFormData>(initial());

    transform((form) => ({
        ...form,
        height: clean(form.height),
        weight: clean(form.weight),
        temperature: clean(form.temperature),
        heart_rate: clean(form.heart_rate),
        respiratory_rate: clean(form.respiratory_rate),
        condition_score: clean(form.condition_score),
        notes: clean(form.notes),
        checked_by: clean(form.checked_by),
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

        put(route('monitorings.update', monitoring.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit reading for ${monitoring.horse_name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit monitoring reading</DialogTitle>
                        <DialogDescription>Update this reading for {monitoring.horse_name}.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <MonitoringFields data={data} setData={setData} errors={errors} options={options} />
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
