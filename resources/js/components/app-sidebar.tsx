import AppBrand from '@/components/app-brand';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { navItemsFor } from '@/lib/navigation';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const navItems = navItemsFor(Boolean(auth?.is_admin));
    const { state } = useSidebar();

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="h-header flex-row items-center justify-between gap-2 border-b border-sidebar-border px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1">
                <Link href="/dashboard" prefetch className="flex min-w-0 items-center gap-2.5">
                    <AppBrand markOnly={state === 'collapsed'} />
                </Link>
                <SidebarTrigger className="text-subtle-foreground hover:text-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarHeader>

            <SidebarContent className="px-1 pt-3">
                <NavMain label="Main" items={navItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
