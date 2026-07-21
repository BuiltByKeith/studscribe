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
import { type UserRow } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

interface RoleOption {
    id: number;
    title: string;
}

interface UserFormData {
    [key: string]: string | number[];
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_ids: number[];
}

function RoleChecklist({ roleIds, onToggle, roles }: { roleIds: number[]; onToggle: (id: number) => void; roles: RoleOption[] }) {
    if (roles.length === 0) {
        return <p className="text-muted-foreground text-sm">No roles exist yet -- add one on the Roles page first.</p>;
    }

    return (
        <div className="rounded-popover border-border grid gap-2 border p-4 sm:grid-cols-2">
            {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2">
                    <Checkbox checked={roleIds.includes(role.id)} onCheckedChange={() => onToggle(role.id)} />
                    <Label className="text-foreground cursor-pointer font-normal">{role.title}</Label>
                </label>
            ))}
        </div>
    );
}

export function AddUserDialog({ options }: { options: { roles: RoleOption[] } }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_ids: [],
    });

    const toggleRole = (id: number) => {
        setData('role_ids', data.role_ids.includes(id) ? data.role_ids.filter((x) => x !== id) : [...data.role_ids, id]);
    };

    const onOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            reset();
            clearErrors();
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="gradient">
                    <Plus className="size-4" />
                    Add User
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Add a user</DialogTitle>
                        <DialogDescription>Creates a staff account with the roles you choose below.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <FormSection title="Account">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="name" label="Name" required error={errors.name}>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                                </FormField>

                                <FormField id="email" label="Email" required error={errors.email}>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                </FormField>

                                <FormField id="password" label="Password" required error={errors.password}>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </FormField>

                                <FormField id="password_confirmation" label="Confirm password" required error={errors.password_confirmation}>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Roles" description="What this account is allowed to do.">
                            <RoleChecklist roleIds={data.role_ids} onToggle={toggleRole} roles={options.roles} />
                        </FormSection>
                    </DialogBody>

                    <DialogFooter className="border-border border-t">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="gradient" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Add user
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function EditUserDialog({ user, options }: { user: UserRow; options: { roles: RoleOption[] } }) {
    const [open, setOpen] = useState(false);

    const initial = (): UserFormData => ({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role_ids: user.roles.map((r) => r.id),
    });

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm<UserFormData>(initial());

    const toggleRole = (id: number) => {
        setData('role_ids', data.role_ids.includes(id) ? data.role_ids.filter((x) => x !== id) : [...data.role_ids, id]);
    };

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

        put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${user.name}`}>
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <form onSubmit={submit} className="flex min-h-0 flex-col">
                    <DialogHeader className="border-border border-b">
                        <DialogTitle>Edit {user.name}</DialogTitle>
                        <DialogDescription>Leave the password fields blank to keep the current password.</DialogDescription>
                    </DialogHeader>

                    <DialogBody className="space-y-6 py-5">
                        <FormSection title="Account">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField id="name" label="Name" required error={errors.name}>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                                </FormField>

                                <FormField id="email" label="Email" required error={errors.email}>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                </FormField>

                                <FormField id="password" label="New password" error={errors.password} hint="optional">
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </FormField>

                                <FormField id="password_confirmation" label="Confirm new password" error={errors.password_confirmation}>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </FormSection>

                        <FormSection title="Roles" description="What this account is allowed to do.">
                            <RoleChecklist roleIds={data.role_ids} onToggle={toggleRole} roles={options.roles} />
                        </FormSection>
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
