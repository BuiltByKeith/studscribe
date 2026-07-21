import { FormField } from '@/components/form-field';
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
import { type PermissionRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface PermissionFormData {
    [key: string]: string;
    title: string;
}

function PermissionFields({
    data,
    setData,
    errors,
}: {
    data: PermissionFormData;
    setData: (key: 'title', value: string) => void;
    errors: Partial<Record<keyof PermissionFormData, string>>;
}) {
    return (
        <FormField id="title" label="Permission title" required error={errors.title} hint="resource.action, e.g. horse.view">
            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="horse.view" autoFocus />
        </FormField>
    );
}

export function AddPermissionDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<PermissionFormData>({ title: '' });

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('permissions.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Permission
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Add a permission</DialogTitle>
                        <DialogDescription>Permissions are granted to roles, not directly to users.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <PermissionFields data={data} setData={setData} errors={errors} />
                    </DialogBody>

                    <DialogFooter className="border-border border-t">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add permission
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditPermissionDialog({ permission }: { permission: PermissionRow }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<PermissionFormData>({ title: permission.title });

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData({ title: permission.title });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('permissions.update', permission.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${permission.title}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Edit {permission.title}</DialogTitle>
                        <DialogDescription>Update the permission's title.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <PermissionFields data={data} setData={setData} errors={errors} />
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
