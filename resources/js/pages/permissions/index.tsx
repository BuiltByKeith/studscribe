import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { DeletePermissionDialog } from '@/components/permissions/delete-permission-dialog';
import { AddPermissionDialog, EditPermissionDialog } from '@/components/permissions/permission-form-dialog';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Paginated, type PermissionRow } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Permission', 'Granted To', 'Actions'];

export default function PermissionsIndex({ permissions }: { permissions: Paginated<PermissionRow> }) {
    return (
        <AppLayout>
            <Head title="Permissions" />

            <div className="p-content flex flex-1 flex-col gap-6">
                <PageHeader title="Permissions" description="The individual grants that roles are built from." actions={<AddPermissionDialog />} />

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
                            {permissions.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No permissions recorded yet.</TableEmpty>
                            ) : (
                                permissions.data.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="text-foreground font-mono text-sm font-semibold whitespace-nowrap">
                                            {permission.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {permission.roles_count} role{permission.roles_count === 1 ? '' : 's'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditPermissionDialog permission={permission} />
                                                <DeletePermissionDialog
                                                    permissionId={permission.id}
                                                    permissionTitle={permission.title}
                                                    rolesCount={permission.roles_count}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-border border-t px-4 py-3">
                        <DataTablePagination paginator={permissions} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
