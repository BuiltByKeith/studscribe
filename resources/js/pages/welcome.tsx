import AppBrand from '@/components/app-brand';
import { Horse } from '@/components/icons/horse';
import { Button } from '@/components/ui/button';
import { CAT_CLASSES, type CatHue } from '@/lib/categorical';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ArrowRight, Heart, UserCog } from 'lucide-react';

interface Feature {
    icon: React.ComponentType<{ className?: string }>;
    hue: CatHue;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    {
        icon: Horse,
        hue: 'blue',
        title: 'Horses & Pedigree',
        description: "Every horse's lineage -- sire, dam, siblings, and offspring -- mapped automatically as parents get linked.",
    },
    {
        icon: Heart,
        hue: 'pink',
        title: 'Breeding Cycles',
        description: 'Cover dates, cycles, and 21-day checks tracked per pairing, with the next due date counting down on its own.',
    },
    {
        icon: Activity,
        hue: 'emerald',
        title: 'Wellness & Vaccinations',
        description: 'Vitals, body condition scores, and vaccination schedules logged and flagged before anything falls overdue.',
    },
    {
        icon: UserCog,
        hue: 'violet',
        title: 'Staff & Permissions',
        description: 'Give every team member exactly the access their role needs, from stable hand to farm admin.',
    },
];

const STEPS = [
    {
        number: '01',
        title: 'Record',
        description: 'Add horses, pedigree, and breeding pairs as they happen -- no spreadsheet to keep in sync.',
    },
    {
        number: '02',
        title: 'Monitor',
        description: 'Vitals, vaccinations, and cycle checkups tracked against their due dates automatically.',
    },
    {
        number: '03',
        title: 'Decide',
        description: 'One dashboard surfaces what needs attention today, across every horse on the farm.',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const year = new Date().getFullYear();

    return (
        <>
            <Head title="Welcome">
                <meta
                    name="description"
                    content="StudScribe is the record book for your stud farm -- pedigree, breeding cycles, wellness, and vaccinations, tracked for every horse."
                />
            </Head>

            <div className="bg-background text-foreground flex min-h-screen flex-col">
                <SiteHeader isAuthenticated={Boolean(auth.user)} />

                <main className="flex-1">
                    <Hero isAuthenticated={Boolean(auth.user)} />

                    <FeatureSection />

                    <WorkflowSection />

                    <FinalCta isAuthenticated={Boolean(auth.user)} />
                </main>

                <SiteFooter year={year} />
            </div>
        </>
    );
}

function SiteHeader({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <header className="border-border bg-surface border-b">
            <div className="h-header px-content mx-auto flex max-w-6xl items-center justify-between gap-4">
                <Link href="/" className="flex min-w-0 items-center gap-2.5">
                    <AppBrand />
                </Link>

                <nav className="flex shrink-0 items-center gap-2">
                    {isAuthenticated ? (
                        <Button asChild variant="gradient" size="sm">
                            <Link href={route('dashboard')}>Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('login')}>Log in</Link>
                            </Button>
                            <Button asChild variant="gradient" size="sm">
                                <Link href={route('register')}>Get Started</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

/**
 * The dark hero reuses the theme's `foreground`/`background` pair in reverse
 * rather than a one-off color -- this app is deliberately light-only, so a
 * dark band still has to come from the same token set as everything else.
 */
function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <section className="bg-foreground text-background relative overflow-hidden">
            <div
                className="bg-brand-gradient pointer-events-none absolute top-1/2 left-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
                aria-hidden="true"
            />

            <div className="px-content relative mx-auto flex max-w-4xl flex-col items-center gap-7 py-24 text-center lg:py-32">
                <div
                    className="bg-brand-gradient rounded-brand shadow-brand size-16 shrink-0 overflow-hidden opacity-100 transition-all duration-700 starting:translate-y-3 starting:opacity-0"
                    aria-hidden="true"
                >
                    <img src="/images/studscribe-logo.png" alt="" className="size-full scale-[1.3] object-cover" />
                </div>

                <p className="group-label text-background/60 opacity-100 transition-all delay-100 duration-700 starting:translate-y-3 starting:opacity-0">
                    Stud Farm Management
                </p>

                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance opacity-100 transition-all delay-150 duration-700 sm:text-5xl lg:text-6xl starting:translate-y-3 starting:opacity-0">
                    The record book for your entire stud farm.
                </h1>

                <p className="text-background/70 max-w-xl text-lg text-balance opacity-100 transition-all delay-200 duration-700 starting:translate-y-3 starting:opacity-0">
                    Pedigree, breeding cycles, vaccinations, and vitals -- tracked for every horse, from foal to broodmare.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 opacity-100 transition-all delay-300 duration-700 starting:translate-y-3 starting:opacity-0">
                    <Button asChild variant="gradient" size="lg">
                        <Link href={route(isAuthenticated ? 'dashboard' : 'register')}>
                            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>

                    {!isAuthenticated && (
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-background/20 text-background hover:bg-background/10 bg-transparent"
                        >
                            <Link href={route('login')}>Sign in</Link>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}

function FeatureSection() {
    return (
        <section className="px-content mx-auto max-w-6xl py-20 lg:py-24">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
                <p className="group-label text-primary">What StudScribe covers</p>
                <h2 className="text-foreground text-3xl font-bold tracking-tight">Everything a stud farm needs to track, in one system.</h2>
            </div>

            <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((feature) => (
                    <div key={feature.title} className="flex flex-col items-start gap-3">
                        <span className={cn('rounded-brand grid size-12 shrink-0 place-items-center', CAT_CLASSES[feature.hue])}>
                            <feature.icon className="size-5" />
                        </span>
                        <h3 className="text-foreground text-base font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function WorkflowSection() {
    return (
        <section className="bg-muted/40 py-20 lg:py-24">
            <div className="px-content mx-auto max-w-5xl">
                <div className="max-w-2xl space-y-3">
                    <p className="group-label text-primary">How it works</p>
                    <h2 className="text-foreground text-3xl font-bold tracking-tight">Built around how a stud farm actually runs.</h2>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                    {STEPS.map((step) => (
                        <div key={step.number} className="rounded-popover border-border bg-surface shadow-card border p-6">
                            <span className="text-brand-gradient text-3xl font-bold">{step.number}</span>
                            <h3 className="text-foreground mt-3 text-lg font-bold">{step.title}</h3>
                            <p className="text-muted-foreground mt-1.5 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <section className="bg-brand-gradient text-primary-foreground">
            <div className="px-content mx-auto max-w-2xl py-16 text-center lg:py-20">
                <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                    {isAuthenticated ? 'Pick up right where you left off.' : 'Bring your records into one place.'}
                </h2>
                <p className="text-primary-foreground/85 mt-3">
                    {isAuthenticated ? 'Your dashboard is waiting.' : "Set up your farm's first horse in minutes."}
                </p>
                <Button asChild variant="secondary" size="lg" className="mt-7">
                    <Link href={route(isAuthenticated ? 'dashboard' : 'register')}>
                        {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}

function SiteFooter({ year }: { year: number }) {
    return (
        <footer className="border-border bg-surface border-t">
            <div className="px-content mx-auto flex max-w-6xl flex-col items-center gap-3 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="flex items-center gap-2.5">
                    <AppBrand />
                </div>
                <p className="text-muted-foreground text-xs">&copy; {year} StudScribe. All rights reserved.</p>
            </div>
        </footer>
    );
}
