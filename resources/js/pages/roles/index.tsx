import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { DeleteRoleDialog } from '@/components/roles/delete-role-dialog';
import { AddRoleDialog, EditRoleDialog } from '@/components/roles/role-form-dialog';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EMPTY } from '@/lib/format';
import { type Paginated, type RoleRow } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Role', 'Permissions', 'Users', 'Actions'];

export default function RolesIndex({ roles, options }: { roles: Paginated<RoleRow>; options: { permissions: { id: number; title: string }[] } }) {
    return (
        <AppLayout>
            <Head title="Roles" />

            <div className="p-content flex flex-1 flex-col gap-6">
                <PageHeader
                    title="Roles"
                    description="Bundles of permissions assigned to staff accounts."
                    actions={<AddRoleDialog options={options} />}
                />

                <div className="rounded-popover border-border bg-surface shadow-card overflow-hidden border">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                {COLUMNS.map((column) => (
                                    <TableHead key={column} className={column === 'Actions' ? 'text-right' : undefined}>
                                        {column}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {roles.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No roles recorded yet.</TableEmpty>
                            ) : (
                                roles.data.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="text-foreground font-semibold whitespace-nowrap">{role.title}</TableCell>
                                        <TableCell>
                                            {role.permissions.length === 0 ? (
                                                <span className="text-muted-foreground">{EMPTY}</span>
                                            ) : (
                                                <div className="flex max-w-md flex-wrap gap-1">
                                                    {role.permissions.slice(0, 4).map((permission) => (
                                                        <span
                                                            key={permission.id}
                                                            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-xs"
                                                        >
                                                            {permission.title}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 4 && (
                                                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                                                            +{role.permissions.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {role.users_count} user{role.users_count === 1 ? '' : 's'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditRoleDialog role={role} options={options} />
                                                <DeleteRoleDialog roleId={role.id} roleTitle={role.title} usersCount={role.users_count} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-border border-t px-4 py-3">
                        <DataTablePagination paginator={roles} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
