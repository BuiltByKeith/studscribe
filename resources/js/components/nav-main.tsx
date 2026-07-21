import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface NavMainProps {
    items: NavItem[];
    /** Section heading above the group. Rendered in the theme's group-label treatment. */
    label?: string;
}

/** A link is "active" on its own URL or any path nested under it. */
function isActive(url: string, currentUrl: string): boolean {
    return currentUrl === url || currentUrl.startsWith(`${url}/`) || currentUrl.startsWith(`${url}?`);
}

export function NavMain({ items = [], label = 'Main' }: NavMainProps) {
    const page = usePage();

    return (
        <SidebarGroup className="px-1 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.items && item.items.length > 0 ? (
                        <NavMainCollapsible key={item.title} item={item} currentUrl={page.url} />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive(item.url, page.url)} tooltip={{ children: item.title }}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

/**
 * A nav item with children, e.g. User Management -> Users/Roles/Permissions.
 *
 * Opens by default when the current page is one of its children, so landing
 * on `/roles` directly (not just navigating there through the menu) still
 * shows the submenu expanded rather than hiding the very link that's active.
 */
function NavMainCollapsible({ item, currentUrl }: { item: NavItem; currentUrl: string }) {
    const children = item.items ?? [];
    const childActive = children.some((child) => isActive(child.url, currentUrl));

    return (
        <Collapsible asChild defaultOpen={childActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={childActive} tooltip={{ children: item.title }}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton asChild isActive={isActive(child.url, currentUrl)}>
                                    <Link href={child.url} prefetch>
                                        {child.icon && <child.icon />}
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
