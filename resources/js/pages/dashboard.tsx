import { HorseCell } from '@/components/horse-cell';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TabEmpty } from '@/components/ui/tabs';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { CAT_CLASSES, type CatHue } from '@/lib/categorical';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Activity, Dna, Heart, PawPrint, Star, Syringe, Truck } from 'lucide-react';

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

interface BreedingScheduleEntry {
    id: number;
    stallion_name: string | null;
    stallion_image: string | null;
    mare_name: string | null;
    mare_image: string | null;
    last_breeding_date: string | null;
    recent_label: string;
    recent_date: string;
    next_due_date: string;
    next_label: string | null;
    is_overdue: boolean;
}

export default function Dashboard({
    stats,
    wellness,
    upcomingVaccinations,
    breedingSchedule,
}: {
    stats: DashboardStats;
    wellness: WellnessEntry[];
    upcomingVaccinations: UpcomingVaccination[];
    breedingSchedule: BreedingScheduleEntry[];
}) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="p-content flex flex-1 flex-col gap-6">
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
                    <section className="rounded-popover border-border bg-surface shadow-card overflow-hidden border">
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

                    <section className="rounded-popover border-border bg-surface shadow-card overflow-hidden border">
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
                                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                                {formatDateShort(item.next_due_date)}
                                            </TableCell>
                                            <TableCell>
                                                <DueStatusBadge overdue={item.is_overdue} date={item.next_due_date} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </section>
                </div>

                {/* Breeding schedule -- half the screen on large viewports; the second grid column is left empty. */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-popover border-border bg-surface shadow-card overflow-hidden border">
                        <CardHeader
                            icon={Heart}
                            hue="pink"
                            title="Breeding Schedule"
                            description="Pairings and when their next cycle or 21-day check is due."
                        />

                        {breedingSchedule.length === 0 ? (
                            <TabEmpty
                                icon={Heart}
                                title="No breeding records"
                                description="Stallion and mare pairings will appear here once a breeding record is added."
                            />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Horse Pair</TableHead>
                                        <TableHead>Breeding Date</TableHead>
                                        <TableHead>Recent Cycle or 21st Day</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {breedingSchedule.map((entry) => (
                                        <BreedingScheduleRow key={entry.id} entry={entry} />
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

function StatCard({
    icon: Icon,
    hue,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    hue: CatHue;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-popover border-border bg-surface shadow-card flex items-center gap-4 border p-6">
            <span className={cn('rounded-brand grid size-12 shrink-0 place-items-center', CAT_CLASSES[hue])}>
                <Icon className="size-5" />
            </span>
            <div className="min-w-0">
                <p className="text-foreground text-3xl font-bold tabular-nums">{value}</p>
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
        <header className="border-border flex items-center gap-3 border-b px-6 py-4">
            <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', CAT_CLASSES[hue])}>
                <Icon className="size-4" />
            </span>
            <div>
                <h3 className="text-foreground text-base font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
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
                    <Avatar className="border-border size-8 shrink-0 border">
                        <AvatarImage src={entry.horse_image ?? PLACEHOLDER_IMAGE} alt={entry.horse_name ?? ''} className="object-cover" />
                        <AvatarFallback className="text-xs">{getInitials(entry.horse_name ?? '')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-semibold">{orEmpty(entry.horse_name)}</p>
                        <p className="text-muted-foreground text-xs">{formatDateShort(entry.monitoring_date)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <ConditionScore score={entry.condition_score} />
            </TableCell>
            <TableCell className="text-muted-foreground whitespace-nowrap">{orEmpty(entry.checked_by)}</TableCell>
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
            <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                {score}/{SCORE_MAX}
            </span>
        </div>
    );
}

/**
 * One breeding pairing. The pair's two avatars overlap like a couple photo,
 * and the third column carries both the recent stage's label/date and the
 * due-status badge for the next one -- the dashboard asked for three columns
 * total, so the badge rides inside the last cell rather than adding a fourth.
 */
function BreedingScheduleRow({ entry }: { entry: BreedingScheduleEntry }) {
    const getInitials = useInitials();

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        <div className="shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-[2px]">
                            <Avatar className="border-surface size-7 border-2">
                                <AvatarImage
                                    src={entry.stallion_image ?? PLACEHOLDER_IMAGE}
                                    alt={entry.stallion_name ?? ''}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-xs">{getInitials(entry.stallion_name ?? '')}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 p-[2px]">
                            <Avatar className="border-surface size-7 border-2">
                                <AvatarImage src={entry.mare_image ?? PLACEHOLDER_IMAGE} alt={entry.mare_name ?? ''} className="object-cover" />
                                <AvatarFallback className="text-xs">{getInitials(entry.mare_name ?? '')}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <p className="text-foreground truncate text-sm font-semibold">
                        {orEmpty(entry.stallion_name)} &amp; {orEmpty(entry.mare_name)}
                    </p>
                </div>
            </TableCell>
            <TableCell className="text-muted-foreground whitespace-nowrap">{formatDateShort(entry.last_breeding_date)}</TableCell>
            <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">
                        {entry.recent_label} &middot; {formatDateShort(entry.recent_date)}
                    </span>
                    <DueStatusBadge overdue={entry.is_overdue} date={entry.next_due_date} expect={entry.next_label} />
                </div>
            </TableCell>
        </TableRow>
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

/**
 * Two states only -- needs attention now (overdue or due today), or
 * scheduled ahead of time -- with the day count alongside. Shared by the
 * vaccination and breeding schedule tables, which both boil down to "is this
 * next-due date in the past or not".
 *
 * `expect` names what the next-due date actually is -- e.g. "2nd Cycle" --
 * so the badge reads "in 12d (2nd Cycle)" instead of a bare day count.
 * Vaccinations don't pass it, since "the next dose" needs no further label.
 */
function DueStatusBadge({ overdue, date, expect }: { overdue: boolean; date: string | null; expect?: string | null }) {
    const days = date ? daysUntil(date) : null;

    let detail = '';

    if (days !== null) {
        if (overdue) {
            detail = days === 0 ? 'today' : `${Math.abs(days)}d ago`;
        } else {
            detail = `in ${days}d`;
        }

        if (expect) {
            detail += ` (${expect})`;
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
