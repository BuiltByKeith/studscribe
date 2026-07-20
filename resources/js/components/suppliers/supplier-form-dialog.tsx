import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SupplierRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface SupplierFormData {
    [key: string]: string;
    supplier_name: string;
    address: string;
    contact: string;
    status: string;
}

const INITIAL: SupplierFormData = { supplier_name: '', address: '', contact: '', status: 'active' };

function clean(value: string): string | null {
    return value.trim() === '' ? null : value;
}

function SupplierFields({
    data,
    setData,
    errors,
}: {
    data: SupplierFormData;
    setData: (key: keyof SupplierFormData, value: string) => void;
    errors: Partial<Record<keyof SupplierFormData, string>>;
}) {
    return (
        <div className="space-y-4">
            <FormField id="supplier_name" label="Supplier name" required error={errors.supplier_name}>
                <Input
                    id="supplier_name"
                    value={data.supplier_name}
                    onChange={(e) => setData('supplier_name', e.target.value)}
                    placeholder="Highfield Stud"
                    autoFocus
                />
            </FormField>

            <FormField id="address" label="Address" error={errors.address}>
                <textarea
                    id="address"
                    rows={2}
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Street, city, region"
                    className="flex w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden"
                />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="contact" label="Contact number" error={errors.contact}>
                    <Input id="contact" value={data.contact} onChange={(e) => setData('contact', e.target.value)} placeholder="+63 917 555 0142" />
                </FormField>

                <FormField id="status" label="Status" required error={errors.status}>
                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            </div>
        </div>
    );
}

export function AddSupplierDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<SupplierFormData>(INITIAL);

    transform((form) => ({ ...form, address: clean(form.address), contact: clean(form.contact) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('suppliers.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Supplier
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Add a supplier</DialogTitle>
                        <DialogDescription>Studs and dealers horses are acquired from.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <SupplierFields data={data} setData={setData} errors={errors} />
                    </DialogBody>

                    <DialogFooter className="border-t border-border">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add supplier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditSupplierDialog({ supplier }: { supplier: SupplierRow }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors, transform } = useForm<SupplierFormData>({
        supplier_name: supplier.supplier_name,
        address: supplier.address ?? '',
        contact: supplier.contact ?? '',
        status: supplier.status,
    });

    transform((form) => ({ ...form, address: clean(form.address), contact: clean(form.contact) }));

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setData({
                supplier_name: supplier.supplier_name,
                address: supplier.address ?? '',
                contact: supplier.contact ?? '',
                status: supplier.status,
            });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(route('suppliers.update', supplier.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${supplier.supplier_name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-b border-border">
                        <DialogTitle>Edit {supplier.supplier_name}</DialogTitle>
                        <DialogDescription>Update this supplier's details.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <SupplierFields data={data} setData={setData} errors={errors} />
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
