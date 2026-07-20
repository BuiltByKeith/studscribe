import { SexBadge } from '@/components/horses/attribute-badges';
import { AddGenderDialog, EditGenderDialog } from '@/components/genders/gender-form-dialog';
import { DeleteGenderDialog } from '@/components/genders/delete-gender-dialog';
import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type GenderRow, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Gender Name', 'Sex', 'Description', 'Actions'];

export default function GendersIndex({ genders }: { genders: Paginated<GenderRow> }) {
    return (
        <AppLayout>
            <Head title="Genders" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Genders"
                    description="Equine designations such as stallion, mare, and gelding."
                    actions={<AddGenderDialog />}
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
                            {genders.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No genders recorded yet.</TableEmpty>
                            ) : (
                                genders.data.map((gender) => (
                                    <TableRow key={gender.id}>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">{gender.name}</TableCell>
                                        <TableCell>
                                            <SexBadge sex={gender.sex} />
                                        </TableCell>
                                        <TableCell>
                                            <span className="block max-w-md truncate text-muted-foreground" title={gender.description ?? undefined}>
                                                {orEmpty(gender.description)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditGenderDialog gender={gender} />
                                                <DeleteGenderDialog genderId={gender.id} genderName={gender.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={genders} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
