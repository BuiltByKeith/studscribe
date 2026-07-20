import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type VaccineRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface VaccineFormData {
    [key: string]: string;
    name: string;
    manufacturer: string;
    dose: string;
}

const INITIAL: VaccineFormData = { name: '', manufacturer: '', dose: '' };

function clean(value: string): string | null {
    return value.trim() === '' ? null : value;
}

function VaccineFields({
    data,
    setData,
    errors,
}: {
    data: VaccineFormData;
    setData: (key: keyof VaccineFormData, value: string) => void;
    errors: Partial<Record<keyof VaccineFormData, string>>;
}) {
    return (
        <div className="space-y-4">
            <FormField id="name" label="Vaccine name" required error={errors.name}>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Tetanus Toxoid" autoFocus />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="manufacturer" label="Manufacturer" error={errors.manufacturer}>
                    <Input
                        id="manufacturer"
                        value={data.manufacturer}
                        onChange={(e) => setData('manufacturer', e.target.value)}
                        placeholder="Zoetis"
                    />
                </FormField>

                <FormField id="dose" label="Dose" error={errors.dose}>
                    <Input id="dose" value={data.dose} onChange={(e) => setData('dose', e.target.value)} placeholder="1 mL" />
                </FormField>
            </div>
        </div>
    );
}

export function AddVaccineDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<VaccineFormData>(INITIAL);

    transform((form) => ({ ...form, manufacturer: clean(form.manufacturer), dose: clean(form.dose) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('vaccines.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Vaccine
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a vaccine</DialogTitle>
                        <DialogDescription>Only the name is required.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <VaccineFields data={data} setData={setData} errors={errors} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add vaccine
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditVaccineDialog({ vaccine }: { vaccine: VaccineRow }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<VaccineFormData>({
        name: vaccine.name,
        manufacturer: vaccine.manufacturer ?? '',
        dose: vaccine.dose ?? '',
    });

    transform((form) => ({ ...form, manufacturer: clean(form.manufacturer), dose: clean(form.dose) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData({ name: vaccine.name, manufacturer: vaccine.manufacturer ?? '', dose: vaccine.dose ?? '' });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('vaccines.update', vaccine.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${vaccine.name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit {vaccine.name}</DialogTitle>
                        <DialogDescription>Update this vaccine's catalogue details.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <VaccineFields data={data} setData={setData} errors={errors} />
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
