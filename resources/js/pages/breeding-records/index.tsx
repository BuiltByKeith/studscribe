import { BreedingRecordDetailsDialog } from '@/components/breeding-records/breeding-record-details-dialog';
import { AddBreedingRecordDialog, EditBreedingRecordDialog } from '@/components/breeding-records/breeding-record-form-dialog';
import { DeleteBreedingRecordDialog } from '@/components/breeding-records/delete-breeding-record-dialog';
import { DataTablePagination } from '@/components/data-table-pagination';
import { HorseCell } from '@/components/horse-cell';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EMPTY, formatDateShort } from '@/lib/format';
import { type BreedingRecordFormOptions, type BreedingRecordRow, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { StickyNote } from 'lucide-react';
import { useState } from 'react';

const COLUMNS = [
    'Stallion',
    'Mare',
    'Last Breeding',
    '1st Cycle',
    '21st Day',
    '2nd Cycle',
    '21st Day',
    '3rd Cycle',
    '21st Day',
    '4th Cycle',
    'Actions',
];

function CycleDate({ date, notes }: { date: string | null; notes?: string | null }) {
    if (!date) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            {formatDateShort(date)}
            {notes && (
                <span title={notes} aria-label="Has notes">
                    <StickyNote className="text-muted-foreground size-3.5 shrink-0" />
                </span>
            )}
        </span>
    );
}

export default function BreedingRecordsIndex({
    breedingRecords,
    options,
}: {
    breedingRecords: Paginated<BreedingRecordRow>;
    options: BreedingRecordFormOptions;
}) {
    const [viewing, setViewing] = useState<BreedingRecordRow | null>(null);

    return (
        <AppLayout>
            <Head title="Breeding Records" />

            <div className="p-content flex flex-1 flex-col gap-6">
                <PageHeader
                    title="Breeding Records"
                    description="Stallion and mare pairings tracked through each breeding cycle and its 21-day check."
                    actions={<AddBreedingRecordDialog options={options} />}
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
                            {breedingRecords.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No breeding records yet.</TableEmpty>
                            ) : (
                                breedingRecords.data.map((record) => (
                                    <TableRow
                                        key={record.id}
                                        tabIndex={0}
                                        onClick={() => setViewing(record)}
                                        onKeyDown={(e) => {
                                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                                e.preventDefault();
                                                setViewing(record);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <TableCell>
                                            <HorseCell name={record.stallion_name} image={record.stallion_image} />
                                        </TableCell>
                                        <TableCell>
                                            <HorseCell name={record.mare_name} image={record.mare_image} />
                                        </TableCell>
                                        <TableCell className="text-foreground font-semibold whitespace-nowrap">
                                            {formatDateShort(record.last_breeding_date)}
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_1_date} notes={record.cycle_1_notes} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_1_day21_date} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_2_date} notes={record.cycle_2_notes} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_2_day21_date} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_3_date} notes={record.cycle_3_notes} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_3_day21_date} />
                                        </TableCell>
                                        <TableCell>
                                            <CycleDate date={record.cycle_4_date} notes={record.cycle_4_notes} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <EditBreedingRecordDialog record={record} options={options} />
                                                <DeleteBreedingRecordDialog
                                                    recordId={record.id}
                                                    stallionName={record.stallion_name}
                                                    mareName={record.mare_name}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-border border-t px-4 py-3">
                        <DataTablePagination paginator={breedingRecords} />
                    </div>
                </div>
            </div>

            <BreedingRecordDetailsDialog record={viewing} onOpenChange={(open) => !open && setViewing(null)} />
        </AppLayout>
    );
}
