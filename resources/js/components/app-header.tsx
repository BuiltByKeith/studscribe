import AppBrand from '@/components/app-brand';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { navItemsFor } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
    /** Right-aligned actions, e.g. a primary call to action. */
    actions?: React.ReactNode;
}

export function AppHeader({ actions }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const mainNavItems = navItemsFor(Boolean(auth?.is_admin));

    return (
        <div className="border-b border-border bg-surface">
            <div className="mx-auto flex h-header max-w-7xl items-center gap-3 px-content">
                {/* Mobile navigation */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-2 size-9 lg:hidden">
                            <Menu className="size-5" />
                            <span className="sr-only">Open navigation</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-(--sidebar-width-mobile) bg-sidebar p-0">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SheetHeader className="h-header flex-row items-center border-b border-sidebar-border px-3 text-left">
                            <AppBrand />
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 p-2">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.url}
                                    className={cn(
                                        'flex h-nav-item items-center gap-2.5 rounded-nav px-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted hover:text-foreground',
                                        page.url === item.url && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground',
                                    )}
                                >
                                    {item.icon && <Icon iconNode={item.icon} className="size-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>

                <Link href="/dashboard" prefetch className="flex items-center gap-2.5">
                    <AppBrand />
                </Link>

                {/* Desktop navigation */}
                <nav className="ml-6 hidden items-center gap-1 lg:flex">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={cn(
                                'flex h-nav-item items-center gap-2 rounded-nav px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                page.url === item.url && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground',
                            )}
                        >
                            {item.icon && <Icon iconNode={item.icon} className="size-4" />}
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {actions}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto gap-2.5 px-2 py-1.5">
                                <UserInfo user={auth.user} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-60" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
