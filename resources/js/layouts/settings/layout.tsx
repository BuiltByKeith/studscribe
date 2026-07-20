import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
    },
    {
        title: 'Password',
        url: '/settings/password',
    },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    // Read the current path from Inertia rather than `window.location` -- this
    // component also renders under SSR, where `window` does not exist.
    const { url } = usePage();

    return (
        <div className="flex flex-1 flex-col gap-6 p-content">
            <PageHeader title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-48">
                    <nav className="flex flex-col gap-1">
                        {sidebarNavItems.map((item) => (
                            <Link
                                key={item.url}
                                href={item.url}
                                prefetch
                                className={cn(
                                    'flex h-nav-item items-center rounded-nav px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                    url === item.url && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground hover:bg-primary-tint-hover',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <Separator className="lg:hidden" />

                <div className="flex-1 lg:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
