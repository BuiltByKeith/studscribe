import { BreedBadge, GenderBadge, SexBadge } from '@/components/horses/attribute-badges';
import { PedigreeTree, type Pedigree, type PedigreeNode } from '@/components/horses/pedigree-tree';
import { BreedingTable, MedicalTable, MonitoringTable, VaccinationTable, type HorseRecords } from '@/components/horses/record-tables';
import { Button } from '@/components/ui/button';
import { TabEmpty, TabList, TabPanel, type TabDefinition } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatAge, formatDate, formatPercent, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Baby,
    Cake,
    CalendarOff,
    CalendarPlus,
    Dna,
    GitBranch,
    Hash,
    Heart,
    Palette,
    Stethoscope,
    Syringe,
    Tags,
    Truck,
    Users,
    VenusAndMars,
} from 'lucide-react';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

interface HorseDetail {
    id: number;
    horse_name: string;
    horse_image: string | null;
    registration_no: string | null;
    birth_date: string | null;
    acquisition_date: string | null;
    retirement_date: string | null;
    supplier: string | null;
    gender: string | null;
    sex: 'male' | 'female' | null;
    color: string | null;
    breed: string | null;
    breed_percentage: string | number | null;
    is_retired: boolean;
}

export default function HorseShow({ horse, pedigree, records }: { horse: HorseDetail; pedigree: Pedigree; records: HorseRecords }) {
    const [tab, setTab] = useState('pedigree');

    const tabs: TabDefinition[] = [
        { value: 'pedigree', label: 'Pedigree', icon: GitBranch },
        { value: 'offspring', label: 'Offspring', icon: Baby, badge: pedigree.offspring.length },
        { value: 'siblings', label: 'Siblings', icon: Users, badge: pedigree.siblings.length },
        { value: 'monitoring', label: 'Monitoring', icon: Activity, badge: records.monitorings.length },
        { value: 'vaccination', label: 'Vaccination Record', icon: Syringe, badge: records.vaccinations.length },
        { value: 'medical', label: 'Medical Record', icon: Stethoscope, badge: records.medical_records.length },
        { value: 'breeding', label: 'Breeding Record', icon: Heart, badge: records.breeding_records.length },
    ];

    return (
        <AppLayout>
            <Head title={horse.horse_name} />

            <div className="p-content flex flex-1 flex-col gap-6">
                {/* Back sits at the far left, with the page identity beside it. */}
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="size-10 shrink-0">
                        <Link href={route('horses.index')} aria-label="Back to horses">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>

                    <div className="min-w-0 space-y-0.5">
                        <h1 className="text-foreground truncate text-2xl font-bold tracking-tight">Horse Details</h1>
                        <p className="text-muted-foreground text-sm">Full detail of the horse.</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Identity card -- one third */}
                    {/* Grid items stretch to the row height, so the card is
                        already as tall as the details panel -- centring the
                        content vertically is what removes the dead space that
                        left. */}
                    <section className="rounded-popover border-border bg-surface shadow-card flex flex-col justify-center border p-6 lg:col-span-1">
                        <div className="flex flex-col items-center text-center">
                            {/* Gradient ring, then a thin surface gap, then the
                                photo -- the inset keeps the gradient reading as
                                a border rather than bleeding into the image. */}
                            <div className="bg-brand-gradient shadow-brand size-48 shrink-0 rounded-full p-[3px]">
                                <div className="bg-surface size-full rounded-full p-1">
                                    <img
                                        src={horse.horse_image ?? PLACEHOLDER_IMAGE}
                                        alt={horse.horse_name}
                                        className="bg-muted size-full rounded-full object-cover"
                                    />
                                </div>
                            </div>

                            <h2 className="text-foreground mt-5 text-2xl font-bold tracking-tight text-balance">{horse.horse_name}</h2>

                            <span
                                className={cn(
                                    'mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                                    horse.is_retired ? 'bg-muted text-muted-foreground' : 'bg-success-tint text-success',
                                )}
                            >
                                <span
                                    className={cn('size-1.5 rounded-full', horse.is_retired ? 'bg-muted-foreground' : 'bg-success')}
                                    aria-hidden="true"
                                />
                                {horse.is_retired ? 'Retired' : 'Active'}
                            </span>
                        </div>
                    </section>

                    {/* Details card -- two thirds */}
                    {/* `overflow-hidden` so the grid's bg-border hairline layer,
                        which is square-cornered, gets clipped to the card's
                        radius instead of squaring off the bottom corners. */}
                    <section className="rounded-popover border-border bg-surface shadow-card overflow-hidden border lg:col-span-2">
                        <header className="border-border border-b px-6 py-4">
                            <h3 className="text-foreground text-base font-semibold">Details</h3>
                            <p className="text-muted-foreground text-sm">Registration, lineage, and acquisition record.</p>
                        </header>

                        <dl className="bg-border grid gap-px overflow-hidden sm:grid-cols-2">
                            <DetailRow icon={Hash} label="Registration number">
                                {orEmpty(horse.registration_no)}
                            </DetailRow>

                            <DetailRow icon={Cake} label="Age" hint={horse.birth_date ? `Born ${formatDate(horse.birth_date)}` : undefined}>
                                {formatAge(horse.birth_date)}
                            </DetailRow>

                            <DetailRow icon={VenusAndMars} label="Sex">
                                <SexBadge sex={horse.sex} />
                            </DetailRow>

                            <DetailRow icon={Tags} label="Gender">
                                <GenderBadge gender={horse.gender} />
                            </DetailRow>

                            <DetailRow
                                icon={Dna}
                                label="Breed"
                                hint={horse.breed_percentage !== null ? `${formatPercent(horse.breed_percentage)} purebred` : undefined}
                            >
                                <BreedBadge breed={horse.breed} />
                            </DetailRow>

                            <DetailRow icon={Palette} label="Colour">
                                {orEmpty(horse.color)}
                            </DetailRow>

                            <DetailRow icon={Truck} label="Supplier">
                                {orEmpty(horse.supplier)}
                            </DetailRow>

                            <DetailRow icon={CalendarPlus} label="Acquired">
                                {formatDate(horse.acquisition_date)}
                            </DetailRow>

                            <DetailRow icon={CalendarOff} label="Retired" className="sm:col-span-2">
                                {horse.retirement_date ? (
                                    formatDate(horse.retirement_date)
                                ) : (
                                    <span className="text-muted-foreground">Still active</span>
                                )}
                            </DetailRow>
                        </dl>
                    </section>
                </div>

                {/* Records ------------------------------------------------ */}
                <section className="rounded-popover border-border bg-surface shadow-card overflow-hidden border">
                    <div className="border-border bg-muted/40 border-b">
                        <TabList tabs={tabs} value={tab} onValueChange={setTab} />
                    </div>

                    <TabPanel key={tab}>
                        {tab === 'pedigree' && <PedigreeTree pedigree={pedigree} />}

                        {tab === 'offspring' &&
                            (pedigree.offspring.length > 0 ? (
                                <RelatedGrid nodes={pedigree.offspring} />
                            ) : (
                                <TabEmpty
                                    icon={Baby}
                                    title="No offspring recorded"
                                    description="Horses linked to this one as their sire or dam will appear here."
                                />
                            ))}

                        {tab === 'siblings' &&
                            (pedigree.siblings.length > 0 ? (
                                <RelatedGrid nodes={pedigree.siblings} />
                            ) : (
                                <TabEmpty
                                    icon={Users}
                                    title="No siblings recorded"
                                    description="Siblings are derived from shared parents. Link this horse's sire or dam to find them."
                                />
                            ))}

                        {tab === 'monitoring' &&
                            (records.monitorings.length > 0 ? (
                                <MonitoringTable records={records.monitorings} />
                            ) : (
                                <TabEmpty
                                    icon={Activity}
                                    title="No wellness readings"
                                    description="Vitals and body condition readings recorded for this horse will appear here."
                                />
                            ))}

                        {tab === 'vaccination' &&
                            (records.vaccinations.length > 0 ? (
                                <VaccinationTable records={records.vaccinations} />
                            ) : (
                                <TabEmpty
                                    icon={Syringe}
                                    title="No vaccination records"
                                    description="Doses administered to this horse, and the boosters they fall due for, will appear here."
                                />
                            ))}

                        {tab === 'medical' &&
                            (records.medical_records.length > 0 ? (
                                <MedicalTable records={records.medical_records} />
                            ) : (
                                <TabEmpty
                                    icon={Stethoscope}
                                    title="No medical records"
                                    description="Veterinary visits, diagnoses, and treatments for this horse will appear here."
                                />
                            ))}

                        {tab === 'breeding' &&
                            (records.breeding_records.length > 0 ? (
                                <BreedingTable records={records.breeding_records} />
                            ) : (
                                <TabEmpty
                                    icon={Heart}
                                    title="No breeding records"
                                    description="Pairings this horse is part of, and their cycle progress, will appear here."
                                />
                            ))}
                    </TabPanel>
                </section>
            </div>
        </AppLayout>
    );
}

/** Shared card grid for the offspring and siblings tabs. */
function RelatedGrid({ nodes }: { nodes: PedigreeNode[] }) {
    return (
        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {nodes.map((node) => (
                <Link
                    key={node.id}
                    href={route('horses.show', node.id!)}
                    className="rounded-popover border-border bg-surface shadow-subtle hover:border-primary/40 hover:bg-muted flex items-center gap-3 border p-3 transition-colors"
                >
                    <img src={node.horse_image ?? PLACEHOLDER_IMAGE} alt="" className="size-11 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-bold">{node.horse_name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                            {[node.kinship, node.breed, node.birth_date ? formatAge(node.birth_date) : null].filter(Boolean).join(' · ') ||
                                'No details'}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

interface DetailRowProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    /** Secondary line under the value, e.g. the date behind an age. */
    hint?: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * One labelled fact.
 *
 * The grid uses a 1px gap over a border-coloured background, so the hairlines
 * between cells come from the gap itself -- no per-cell border rules that have
 * to be selectively removed at the edges.
 */
function DetailRow({ icon: Icon, label, hint, className, children }: DetailRowProps) {
    return (
        <div className={cn('bg-surface flex items-start gap-3 px-6 py-4', className)}>
            <span className="bg-muted text-muted-foreground mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg">
                <Icon className="size-4" />
            </span>

            <div className="min-w-0 space-y-1">
                <dt className="group-label">{label}</dt>
                <dd className="text-foreground text-sm font-semibold">{children}</dd>
                {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            </div>
        </div>
    );
}
