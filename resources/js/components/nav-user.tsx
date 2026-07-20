import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronUp } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="group data-[state=open]:bg-muted">
                            <UserInfo user={auth.user} />
                            <ChevronUp className="ml-auto size-4 text-subtle-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {/* Anchored above the trigger -- the trigger sits at the
                        bottom of the sidebar, so a downward menu would open
                        off-screen. */}
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-60"
                        align={state === 'collapsed' && !isMobile ? 'start' : 'end'}
                        side={state === 'collapsed' && !isMobile ? 'right' : 'top'}
                        sideOffset={8}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
