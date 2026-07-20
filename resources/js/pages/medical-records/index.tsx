import { DataTablePagination } from '@/components/data-table-pagination';
import { HorseCell } from '@/components/horse-cell';
import { DeleteMedicalRecordDialog } from '@/components/medical-records/delete-medical-record-dialog';
import { MedicalRecordDetailsDialog } from '@/components/medical-records/medical-record-details-dialog';
import { AddMedicalRecordDialog, EditMedicalRecordDialog } from '@/components/medical-records/medical-record-form-dialog';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type HorseOption, type MedicalRecordRow, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const COLUMNS = ['Horse', 'Date of Visit', 'Veterinarian', 'Diagnosis', 'Treatment', 'Notes', 'Actions'];

function Clamped({ text }: { text: string | null }) {
    if (!text) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <span className="block max-w-56 truncate text-foreground" title={text}>
            {text}
        </span>
    );
}

export default function MedicalRecordsIndex({
    medicalRecords,
    options,
}: {
    medicalRecords: Paginated<MedicalRecordRow>;
    options: { horses: HorseOption[] };
}) {
    const [viewing, setViewing] = useState<MedicalRecordRow | null>(null);

    return (
        <AppLayout>
            <Head title="Medical Records" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Medical Records"
                    description="Veterinary visits, diagnoses, and treatments logged against each horse."
                    actions={<AddMedicalRecordDialog horses={options.horses} />}
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
                            {medicalRecords.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No medical records recorded yet.</TableEmpty>
                            ) : (
                                medicalRecords.data.map((record) => (
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
                                            <HorseCell name={record.horse_name} image={record.horse_image} />
                                        </TableCell>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">
                                            {formatDateShort(record.visit_date)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(record.veterinarian)}</TableCell>
                                        <TableCell>
                                            <Clamped text={record.diagnosis} />
                                        </TableCell>
                                        <TableCell>
                                            <Clamped text={record.treatment} />
                                        </TableCell>
                                        <TableCell>
                                            <span className="block max-w-56 truncate text-muted-foreground" title={record.notes ?? undefined}>
                                                {orEmpty(record.notes)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <EditMedicalRecordDialog record={record} horses={options.horses} />
                                                <DeleteMedicalRecordDialog recordId={record.id} horseName={record.horse_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={medicalRecords} />
                    </div>
                </div>
            </div>

            <MedicalRecordDetailsDialog record={viewing} onOpenChange={(open) => !open && setViewing(null)} />
        </AppLayout>
    );
}
