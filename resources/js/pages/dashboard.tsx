import { HorseCell } from '@/components/horse-cell';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TabEmpty } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import { CAT_CLASSES, type CatHue } from '@/lib/categorical';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Activity, Dna, PawPrint, Star, Syringe, Truck } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';
const SCORE_MAX = 10;

interface DashboardStats {
    horses: number;
    breeds: number;
    suppliers: number;
    vaccines: number;
}

interface WellnessEntry {
    id: number;
    horse_name: string | null;
    horse_image: string | null;
    monitoring_date: string | null;
    condition_score: number | null;
    checked_by: string | null;
}

interface UpcomingVaccination {
    id: number;
    horse_name: string | null;
    horse_image: string | null;
    vaccine: string | null;
    next_due_date: string | null;
    is_overdue: boolean;
}

export default function Dashboard({
    stats,
    wellness,
    upcomingVaccinations,
}: {
    stats: DashboardStats;
    wellness: WellnessEntry[];
    upcomingVaccinations: UpcomingVaccination[];
}) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader title="Dashboard" description="Your farm at a glance." />

                {/* KPI row ------------------------------------------------- */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={PawPrint} hue="blue" label="Horses" value={stats.horses} />
                    <StatCard icon={Dna} hue="violet" label="Breeds" value={stats.breeds} />
                    <StatCard icon={Truck} hue="teal" label="Suppliers" value={stats.suppliers} />
                    <StatCard icon={Syringe} hue="amber" label="Vaccines" value={stats.vaccines} />
                </div>

                {/* Wellness + vaccination, evenly split ------------------- */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="overflow-hidden rounded-popover border border-border bg-surface shadow-card">
                        <CardHeader icon={Activity} hue="emerald" title="Wellness Monitoring" description="Most recent readings across the farm." />

                        {wellness.length === 0 ? (
                            <TabEmpty
                                icon={Activity}
                                title="No wellness readings"
                                description="Vitals and body condition readings will appear here once recorded."
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Date</TableHead>
                                        <TableHead>Condition</TableHead>
                                        <TableHead>Checked By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {wellness.map((entry) => (
                                        <WellnessRow key={entry.id} entry={entry} />
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-popover border border-border bg-surface shadow-card">
                        <CardHeader icon={Syringe} hue="amber" title="Vaccination Schedule" description="Upcoming doses across the farm." />

                        {upcomingVaccinations.length === 0 ? (
                            <TabEmpty
                                icon={Syringe}
                                title="No upcoming doses"
                                description="Boosters and scheduled doses will appear here once a next-due date is recorded."
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Due Vaccination Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingVaccinations.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <HorseCell name={item.horse_name} image={item.horse_image} />
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-muted-foreground">
                                                {formatDateShort(item.next_due_date)}
                                            </TableCell>
                                            <TableCell>
                                                <VaccinationStatusBadge overdue={item.is_overdue} date={item.next_due_date} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ icon: Icon, hue, label, value }: { icon: React.ComponentType<{ className?: string }>; hue: CatHue; label: string; value: number }) {
    return (
        <div className="flex items-center gap-4 rounded-popover border border-border bg-surface p-6 shadow-card">
            <span className={cn('grid size-12 shrink-0 place-items-center rounded-brand', CAT_CLASSES[hue])}>
                <Icon className="size-5" />
            </span>
            <div className="min-w-0">
                <p className="text-3xl font-bold tabular-nums text-foreground">{value}</p>
                <p className="group-label">{label}</p>
            </div>
        </div>
    );
}

/** Shared header for the two record cards below the KPI row. */
function CardHeader({
    icon: Icon,
    hue,
    title,
    description,
}: {
    icon: React.ComponentType<{ className?: string }>;
    hue: CatHue;
    title: string;
    description: string;
}) {
    return (
        <header className="flex items-center gap-3 border-b border-border px-6 py-4">
            <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', CAT_CLASSES[hue])}>
                <Icon className="size-4" />
            </span>
            <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </header>
    );
}

/**
 * One monitoring row. The horse's identity rides inside the date cell rather
 * than as a fourth column -- this table spans every horse on the farm, so
 * "whose reading is this" matters more here than it does on the per-horse
 * detail page, but the column count stays at three.
 */
function WellnessRow({ entry }: { entry: WellnessEntry }) {
    const getInitials = useInitials();

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="size-8 shrink-0 border border-border">
                        <AvatarImage src={entry.horse_image ?? PLACEHOLDER_IMAGE} alt={entry.horse_name ?? ''} className="object-cover" />
                        <AvatarFallback className="text-xs">{getInitials(entry.horse_name ?? '')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{orEmpty(entry.horse_name)}</p>
                        <p className="text-xs text-muted-foreground">{formatDateShort(entry.monitoring_date)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <ConditionScore score={entry.condition_score} />
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(entry.checked_by)}</TableCell>
        </TableRow>
    );
}

function ConditionScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <div className="flex items-center gap-1.5" title={`${score} out of ${SCORE_MAX}`}>
            <div className="flex items-center gap-px" aria-hidden="true">
                {Array.from({ length: SCORE_MAX }, (_, index) => (
                    <Star key={index} className={cn('size-2.5', index < score ? 'fill-primary text-primary' : 'fill-muted text-muted')} />
                ))}
            </div>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {score}/{SCORE_MAX}
            </span>
        </div>
    );
}

/** Whole days between today and `dateValue`. Negative once the date has passed. */
function daysUntil(dateValue: string): number {
    const due = new Date(dateValue);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

/** Two states only -- needs a dose now (overdue or due today), or scheduled ahead of time -- with the day count alongside. */
function VaccinationStatusBadge({ overdue, date }: { overdue: boolean; date: string | null }) {
    const days = date ? daysUntil(date) : null;

    let detail = '';

    if (days !== null) {
        if (overdue) {
            detail = days === 0 ? 'today' : `${Math.abs(days)}d ago`;
        } else {
            detail = `in ${days}d`;
        }
    }

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                overdue ? 'bg-destructive-tint text-destructive' : 'bg-success-tint text-success',
            )}
        >
            <span className={cn('size-1.5 rounded-full', overdue ? 'bg-destructive' : 'bg-success')} aria-hidden="true" />
            {overdue ? 'Due' : 'Upcoming'}
            {detail && <span className="font-normal opacity-80">· {detail}</span>}
        </span>
    );
}
