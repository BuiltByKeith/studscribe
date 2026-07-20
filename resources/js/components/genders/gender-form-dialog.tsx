import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type GenderRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

/** Radix Select cannot hold an empty-string value, so "none" stands in for null. */
const NONE = 'none';

interface GenderFormData {
    [key: string]: string;
    name: string;
    sex: string;
    description: string;
}

function clean(value: string): string | null {
    return value === NONE || value.trim() === '' ? null : value;
}

function GenderFields({
    data,
    setData,
    errors,
}: {
    data: GenderFormData;
    setData: (key: 'name' | 'sex' | 'description', value: string) => void;
    errors: Partial<Record<keyof GenderFormData, string>>;
}) {
    return (
        <div className="space-y-4">
            <FormField id="name" label="Gender name" required error={errors.name}>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Stallion" autoFocus />
            </FormField>

            <FormField id="sex" label="Biological sex" error={errors.sex} hint="which sex this term applies to">
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

            <FormField id="description" label="Description" error={errors.description}>
                <textarea
                    id="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="What this designation means."
                    className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                />
            </FormField>
        </div>
    );
}

export function AddGenderDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<GenderFormData>({
        name: '',
        sex: NONE,
        description: '',
    });

    transform((form) => ({ ...form, sex: clean(form.sex), description: clean(form.description) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('genders.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Gender
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a gender</DialogTitle>
                        <DialogDescription>Life-stage-and-status terms such as stallion, mare, or gelding.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <GenderFields data={data} setData={setData} errors={errors} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add gender
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditGenderDialog({ gender }: { gender: GenderRow }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<GenderFormData>({
        name: gender.name,
        sex: gender.sex ?? NONE,
        description: gender.description ?? '',
    });

    transform((form) => ({ ...form, sex: clean(form.sex), description: clean(form.description) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData({ name: gender.name, sex: gender.sex ?? NONE, description: gender.description ?? '' });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('genders.update', gender.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${gender.name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit {gender.name}</DialogTitle>
                        <DialogDescription>Update this gender designation.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <GenderFields data={data} setData={setData} errors={errors} />
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
