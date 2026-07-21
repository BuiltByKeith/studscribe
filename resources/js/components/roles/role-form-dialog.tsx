import { FormField, FormSection } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { type RoleRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PermissionOption {
    id: number;
    title: string;
}

interface RoleFormData {
    [key: string]: string | number[];
    title: string;
    permission_ids: number[];
}

/** Permissions grouped by the resource before the dot, e.g. "horse.view" -> group "horse". */
function groupPermissions(permissions: PermissionOption[]): [string, PermissionOption[]][] {
    const groups = new Map<string, PermissionOption[]>();

    for (const permission of permissions) {
        const resource = permission.title.split('.')[0] || permission.title;

        if (!groups.has(resource)) {
            groups.set(resource, []);
        }

        groups.get(resource)!.push(permission);
    }

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function RoleFields({
    data,
    setData,
    errors,
    permissions,
}: {
    data: RoleFormData;
    setData: (key: keyof RoleFormData, value: string | number[]) => void;
    errors: Partial<Record<keyof RoleFormData, string>>;
    permissions: PermissionOption[];
}) {
    const groups = useMemo(() => groupPermissions(permissions), [permissions]);

    const toggle = (id: number) => {
        setData('permission_ids', data.permission_ids.includes(id) ? data.permission_ids.filter((x) => x !== id) : [...data.permission_ids, id]);
    };

    return (
        <div className="space-y-6">
            <FormField id="title" label="Role title" required error={errors.title}>
                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Manager" autoFocus />
            </FormField>

            <FormSection title="Permissions" description="What this role's users are allowed to do.">
                {groups.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No permissions exist yet -- add some on the Permissions page first.</p>
                ) : (
                    <div className="rounded-popover border-border max-h-72 space-y-4 overflow-y-auto border p-4">
                        {groups.map(([resource, items]) => (
                            <div key={resource} className="space-y-2">
                                <p className="group-label capitalize">{resource.replace(/_/g, ' ')}</p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {items.map((permission) => (
                                        <label key={permission.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={data.permission_ids.includes(permission.id)}
                                                onCheckedChange={() => toggle(permission.id)}
                                            />
                                            <Label className="text-foreground cursor-pointer font-mono text-xs font-normal">{permission.title}</Label>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </FormSection>
        </div>
    );
}

export function AddRoleDialog({ options }: { options: { permissions: PermissionOption[] } }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<RoleFormData>({ title: '', permission_ids: [] });

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('roles.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add Role
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Add a role</DialogTitle>
                        <DialogDescription>Pick which permissions this role grants. You can change these later.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <RoleFields data={data} setData={setData} errors={errors} permissions={options.permissions} />
                    </DialogBody>

                    <DialogFooter className="border-border border-t">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add role
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditRoleDialog({ role, options }: { role: RoleRow; options: { permissions: PermissionOption[] } }) {
    const [open, setOpen] = useState(false);

    const initial = (): RoleFormData => ({
        title: role.title,
        permission_ids: role.permissions.map((p) => p.id),
    });

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<RoleFormData>(initial());

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

        put(route('roles.update', role.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${role.title}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Edit {role.title}</DialogTitle>
                        <DialogDescription>Changes apply immediately to every user holding this role.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="py-5">
                        <RoleFields data={data} setData={setData} errors={errors} permissions={options.permissions} />
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
