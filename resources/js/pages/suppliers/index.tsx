import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { DeleteSupplierDialog } from '@/components/suppliers/delete-supplier-dialog';
import { AddSupplierDialog, EditSupplierDialog } from '@/components/suppliers/supplier-form-dialog';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type Paginated, type SupplierRow } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Supplier Name', 'Address', 'Contact', 'Status', 'Actions'];

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
    const isActive = status === 'active';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                isActive ? 'bg-success-tint text-success' : 'bg-muted text-muted-foreground',
            )}
        >
            <span className={cn('size-1.5 rounded-full', isActive ? 'bg-success' : 'bg-muted-foreground')} aria-hidden="true" />
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}

export default function SuppliersIndex({ suppliers }: { suppliers: Paginated<SupplierRow> }) {
    return (
        <AppLayout>
            <Head title="Suppliers" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Suppliers"
                    description="Studs and dealers horses are acquired from, and their contact details."
                    actions={<AddSupplierDialog />}
                />

                <div className="overflow-hidden rounded-popover border border-border bg-surface shadow-card">
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
                            {suppliers.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No suppliers recorded yet.</TableEmpty>
                            ) : (
                                suppliers.data.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">
                                            {supplier.supplier_name}
                                        </TableCell>
                                        <TableCell>
                                            <span className="block max-w-xs truncate text-muted-foreground" title={supplier.address ?? undefined}>
                                                {orEmpty(supplier.address)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(supplier.contact)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={supplier.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditSupplierDialog supplier={supplier} />
                                                <DeleteSupplierDialog supplierId={supplier.id} supplierName={supplier.supplier_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={suppliers} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
