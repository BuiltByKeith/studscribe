import { DataTablePagination } from '@/components/data-table-pagination';
import { HorseCell } from '@/components/horse-cell';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteVaccinationDialog } from '@/components/vaccinations/delete-vaccination-dialog';
import { VaccinationDetailsDialog } from '@/components/vaccinations/vaccination-details-dialog';
import { AddVaccinationDialog, EditVaccinationDialog } from '@/components/vaccinations/vaccination-form-dialog';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type HorseOption, type Paginated, type UserOption, type VaccinationRow, type VaccineOption } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const COLUMNS = ['Horse', 'Vaccine', 'Date Administered', 'Next Due Date', 'Administered By', 'Dosage', 'Notes', 'Actions'];

function Notes({ text }: { text: string | null }) {
    if (!text) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <span className="block max-w-64 truncate text-muted-foreground" title={text}>
            {text}
        </span>
    );
}

export default function VaccinationsIndex({
    vaccinations,
    options,
}: {
    vaccinations: Paginated<VaccinationRow>;
    options: { horses: HorseOption[]; vaccines: VaccineOption[]; users: UserOption[] };
}) {
    const [viewing, setViewing] = useState<VaccinationRow | null>(null);

    return (
        <AppLayout>
            <Head title="Vaccination Monitoring" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Vaccination Monitoring"
                    description="Doses administered and boosters coming due, tracked per horse."
                    actions={<AddVaccinationDialog options={options} />}
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
                            {vaccinations.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No vaccinations recorded yet.</TableEmpty>
                            ) : (
                                vaccinations.data.map((vaccination) => (
                                    <TableRow
                                        key={vaccination.id}
                                        tabIndex={0}
                                        onClick={() => setViewing(vaccination)}
                                        onKeyDown={(e) => {
                                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                                e.preventDefault();
                                                setViewing(vaccination);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <TableCell>
                                            <HorseCell name={vaccination.horse_name} image={vaccination.horse_image} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-medium whitespace-nowrap text-foreground">
                                                    {orEmpty(vaccination.vaccine)}
                                                </span>
                                                {vaccination.is_overdue && (
                                                    <span className="rounded-full bg-destructive-tint px-2 py-0.5 text-xs font-semibold text-destructive">
                                                        Overdue
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">
                                            {formatDateShort(vaccination.date_administered)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {formatDateShort(vaccination.next_due_date)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {orEmpty(vaccination.administered_by)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(vaccination.dosage)}</TableCell>
                                        <TableCell>
                                            <Notes text={vaccination.notes} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <EditVaccinationDialog vaccination={vaccination} options={options} />
                                                <DeleteVaccinationDialog vaccinationId={vaccination.id} horseName={vaccination.horse_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={vaccinations} />
                    </div>
                </div>
            </div>

            <VaccinationDetailsDialog vaccination={viewing} onOpenChange={(open) => !open && setViewing(null)} />
        </AppLayout>
    );
}
