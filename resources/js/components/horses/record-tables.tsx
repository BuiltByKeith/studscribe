import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY, formatDateShort, formatMeasure, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export interface MonitoringRecord {
    id: number;
    monitoring_date: string | null;
    height: string | number | null;
    weight: string | number | null;
    temperature: string | number | null;
    heart_rate: number | null;
    respiratory_rate: number | null;
    condition_score: number | null;
    checked_by: string | null;
    notes: string | null;
}

export interface VaccinationRecord {
    id: number;
    date_administered: string | null;
    next_due_date: string | null;
    is_overdue: boolean;
    vaccine: string | null;
    dosage: string | null;
    administered_by: string | null;
    notes: string | null;
}

export interface MedicalRecord {
    id: number;
    visit_date: string | null;
    veterinarian: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
}

export interface HorseRecords {
    monitorings: MonitoringRecord[];
    vaccinations: VaccinationRecord[];
    medical_records: MedicalRecord[];
}

const SCORE_MAX = 10;

/**
 * Body condition as a star rating.
 *
 * The numeral is kept alongside the stars: ten small glyphs are quick to
 * compare between rows but slow to read an exact value from.
 */
function ConditionScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <div className="flex items-center gap-1.5" title={`${score} out of ${SCORE_MAX}`}>
            <div className="flex items-center gap-px" aria-hidden="true">
                {Array.from({ length: SCORE_MAX }, (_, index) => (
                    <Star
                        key={index}
                        className={cn('size-3', index < score ? 'fill-primary text-primary' : 'fill-muted text-muted')}
                    />
                ))}
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {score}/{SCORE_MAX}
            </span>
        </div>
    );
}

/**
 * Free-text cell.
 *
 * Clamped to a readable width with the full text on hover -- notes run long,
 * and letting them size the column pushes every other value off-screen.
 */
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

function DateCell({ value }: { value: string | null }) {
    return <span className="font-semibold whitespace-nowrap text-foreground">{formatDateShort(value)}</span>;
}

/** Shared shell so the three tables sit identically inside their tab panel. */
function RecordTable({ columns, children }: { columns: { key: string; className?: string }[]; children: React.ReactNode }) {
    return (
        <div className="p-6">
            <div className="overflow-hidden rounded-popover border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((column) => (
                                <TableHead key={column.key} className={column.className}>
                                    {column.key}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>{children}</TableBody>
                </Table>
            </div>
        </div>
    );
}

export function MonitoringTable({ records }: { records: MonitoringRecord[] }) {
    return (
        <RecordTable
            columns={[
                { key: 'Date' },
                { key: 'Height' },
                { key: 'Weight' },
                { key: 'Temp.' },
                { key: 'Heart Rate' },
                { key: 'Resp. Rate' },
                { key: 'Condition' },
                { key: 'Checked By' },
                { key: 'Notes' },
            ]}
        >
            {records.map((record) => (
                <TableRow key={record.id}>
                    <TableCell>
                        <DateCell value={record.monitoring_date} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(record.height, 'cm')}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(record.weight, 'kg')}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(record.temperature, '°C')}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(record.heart_rate, 'bpm', 0)}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{formatMeasure(record.respiratory_rate, 'br/min', 0)}</TableCell>
                    <TableCell>
                        <ConditionScore score={record.condition_score} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(record.checked_by)}</TableCell>
                    <TableCell>
                        <Notes text={record.notes} />
                    </TableCell>
                </TableRow>
            ))}
        </RecordTable>
    );
}

export function VaccinationTable({ records }: { records: VaccinationRecord[] }) {
    return (
        <RecordTable columns={[{ key: 'Date' }, { key: 'Vaccine' }, { key: 'Administered By' }, { key: 'Notes' }]}>
            {records.map((record) => (
                <TableRow key={record.id}>
                    <TableCell>
                        <DateCell value={record.date_administered} />
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium whitespace-nowrap text-foreground">{orEmpty(record.vaccine)}</span>
                            {record.dosage && (
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{record.dosage}</span>
                            )}
                            {/* An overdue booster is the one thing on this row
                                that needs acting on, so it is called out. */}
                            {record.is_overdue && (
                                <span className="rounded-full bg-destructive-tint px-2 py-0.5 text-xs font-semibold text-destructive">
                                    Booster overdue
                                </span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(record.administered_by)}</TableCell>
                    <TableCell>
                        <Notes text={record.notes} />
                    </TableCell>
                </TableRow>
            ))}
        </RecordTable>
    );
}

export function MedicalTable({ records }: { records: MedicalRecord[] }) {
    return (
        <RecordTable columns={[{ key: 'Date of Visit' }, { key: 'Veterinarian' }, { key: 'Diagnosis' }, { key: 'Treatment' }, { key: 'Notes' }]}>
            {records.map((record) => (
                <TableRow key={record.id}>
                    <TableCell>
                        <DateCell value={record.visit_date} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(record.veterinarian)}</TableCell>
                    <TableCell>
                        <span className="block max-w-56 truncate font-medium text-foreground" title={record.diagnosis ?? undefined}>
                            {orEmpty(record.diagnosis)}
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="block max-w-56 truncate text-muted-foreground" title={record.treatment ?? undefined}>
                            {orEmpty(record.treatment)}
                        </span>
                    </TableCell>
                    <TableCell>
                        <Notes text={record.notes} />
                    </TableCell>
                </TableRow>
            ))}
        </RecordTable>
    );
}
