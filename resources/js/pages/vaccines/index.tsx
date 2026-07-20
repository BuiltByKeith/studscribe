import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { DeleteVaccineDialog } from '@/components/vaccines/delete-vaccine-dialog';
import { AddVaccineDialog, EditVaccineDialog } from '@/components/vaccines/vaccine-form-dialog';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type Paginated, type VaccineRow } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Vaccine Name', 'Manufacturer', 'Dose', 'Actions'];

export default function VaccinesIndex({ vaccines }: { vaccines: Paginated<VaccineRow> }) {
    return (
        <AppLayout>
            <Head title="Vaccines" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Vaccines"
                    description="The vaccine catalogue, including manufacturer and dose."
                    actions={<AddVaccineDialog />}
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
                            {vaccines.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No vaccines recorded yet.</TableEmpty>
                            ) : (
                                vaccines.data.map((vaccine) => (
                                    <TableRow key={vaccine.id}>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">{vaccine.name}</TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(vaccine.manufacturer)}</TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(vaccine.dose)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditVaccineDialog vaccine={vaccine} />
                                                <DeleteVaccineDialog vaccineId={vaccine.id} vaccineName={vaccine.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={vaccines} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
