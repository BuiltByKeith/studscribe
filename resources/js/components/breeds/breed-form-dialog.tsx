import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type BreedRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface BreedFormData {
    [key: string]: string;
    name: string;
    description: string;
}

function BreedFields({
    data,
    setData,
    errors,
}: {
    data: BreedFormData;
    setData: (key: 'name' | 'description', value: string) => void;
    errors: Partial<Record<keyof BreedFormData, string>>;
}) {
    return (
        <div className="space-y-4">
            <FormField id="name" label="Breed name" required error={errors.name}>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Thoroughbred" autoFocus />
            </FormField>

            <FormField id="description" label="Description" error={errors.description}>
                <textarea
                    id="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="What sets this breed apart."
                    className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                />
            </FormField>
        </div>
    );
}

export function AddBreedDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<BreedFormData>({ name: '', description: '' });

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('breeds.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Breed
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a breed</DialogTitle>
                        <DialogDescription>Only the name is required.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <BreedFields data={data} setData={setData} errors={errors} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add breed
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditBreedDialog({ breed }: { breed: BreedRow }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<BreedFormData>({
        name: breed.name,
        description: breed.description ?? '',
    });

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData({ name: breed.name, description: breed.description ?? '' });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('breeds.update', breed.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${breed.name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit {breed.name}</DialogTitle>
                        <DialogDescription>Update the breed's name or description.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <BreedFields data={data} setData={setData} errors={errors} />
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
