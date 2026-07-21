import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { AddUserDialog, EditUserDialog } from '@/components/users/user-form-dialog';
import AppLayout from '@/layouts/app-layout';
import { EMPTY } from '@/lib/format';
import { type Paginated, type SharedData, type UserRow } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const COLUMNS = ['Name', 'Email', 'Roles', 'Actions'];

export default function UsersIndex({ users, options }: { users: Paginated<UserRow>; options: { roles: { id: number; title: string }[] } }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Users" />

            <div className="p-content flex flex-1 flex-col gap-6">
                <PageHeader
                    title="Users"
                    description="Staff accounts and the roles that govern what each of them can do."
                    actions={<AddUserDialog options={options} />}
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
                            {users.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No users recorded yet.</TableEmpty>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="text-foreground font-semibold whitespace-nowrap">
                                            {user.name}
                                            {user.id === auth.user.id && (
                                                <span className="bg-muted text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
                                                    You
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">{user.email}</TableCell>
                                        <TableCell>
                                            {user.roles.length === 0 ? (
                                                <span className="text-muted-foreground">{EMPTY}</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium"
                                                        >
                                                            {role.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditUserDialog user={user} options={options} />
                                                <DeleteUserDialog userId={user.id} userName={user.name} isSelf={user.id === auth.user.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-border border-t px-4 py-3">
                        <DataTablePagination paginator={users} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
