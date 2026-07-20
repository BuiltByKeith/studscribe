import { DataTablePagination } from '@/components/data-table-pagination';
import { HorseCell } from '@/components/horse-cell';
import { DeleteMonitoringDialog } from '@/components/monitorings/delete-monitoring-dialog';
import { MonitoringDetailsDialog } from '@/components/monitorings/monitoring-details-dialog';
import { AddMonitoringDialog, EditMonitoringDialog } from '@/components/monitorings/monitoring-form-dialog';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY, formatDateShort, formatMeasure, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type HorseOption, type MonitoringRow, type Paginated, type UserOption } from '@/types';
import { Head } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';

const COLUMNS = [
    'Horse',
    'Monitoring Date',
    'Height',
    'Weight',
    'Temp.',
    'Heart Rate',
    'Resp. Rate',
    'Condition',
    'Checked By',
    'Notes',
    'Actions',
];

const SCORE_MAX = 10;

function ConditionScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <div className="flex items-center gap-1.5" title={`${score} out of ${SCORE_MAX}`}>
            <div className="flex items-center gap-px" aria-hidden="true">
                {Array.from({ length: SCORE_MAX }, (_, index) => (
                    <Star key={index} className={cn('size-3', index < score ? 'fill-primary text-primary' : 'fill-muted text-muted')} />
                ))}
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {score}/{SCORE_MAX}
            </span>
        </div>
    );
}

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

export default function MonitoringsIndex({
    monitorings,
    options,
}: {
    monitorings: Paginated<MonitoringRow>;
    options: { horses: HorseOption[]; users: UserOption[] };
}) {
    const [viewing, setViewing] = useState<MonitoringRow | null>(null);

    return (
        <AppLayout>
            <Head title="Wellness Monitoring" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Wellness Monitoring"
                    description="Routine vitals and body condition readings recorded for each horse over time."
                    actions={<AddMonitoringDialog options={options} />}
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
                            {monitorings.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No monitoring readings recorded yet.</TableEmpty>
                            ) : (
                                monitorings.data.map((monitoring) => (
                                    <TableRow
                                        key={monitoring.id}
                                        tabIndex={0}
                                        onClick={() => setViewing(monitoring)}
                                        onKeyDown={(e) => {
                                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                                e.preventDefault();
                                                setViewing(monitoring);
                                            }
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <TableCell>
                                            <HorseCell name={monitoring.horse_name} image={monitoring.horse_image} />
                                        </TableCell>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">
                                            {formatDateShort(monitoring.monitoring_date)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(monitoring.height, 'cm')}</TableCell>
                                        <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(monitoring.weight, 'kg')}</TableCell>
                                        <TableCell className="whitespace-nowrap tabular-nums">
                                            {formatMeasure(monitoring.temperature, '°C')}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap tabular-nums">
                                            {formatMeasure(monitoring.heart_rate, 'bpm', 0)}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap tabular-nums">
                                            {formatMeasure(monitoring.respiratory_rate, 'br/min', 0)}
                                        </TableCell>
                                        <TableCell>
                                            <ConditionScore score={monitoring.condition_score} />
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {orEmpty(monitoring.checked_by)}
                                        </TableCell>
                                        <TableCell>
                                            <Notes text={monitoring.notes} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                <EditMonitoringDialog monitoring={monitoring} options={options} />
                                                <DeleteMonitoringDialog monitoringId={monitoring.id} horseName={monitoring.horse_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={monitorings} />
                    </div>
                </div>
            </div>

            <MonitoringDetailsDialog monitoring={viewing} onOpenChange={(open) => !open && setViewing(null)} />
        </AppLayout>
    );
}
