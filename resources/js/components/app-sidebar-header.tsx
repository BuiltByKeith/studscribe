import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppSidebarHeaderProps {
    /** Context line shown at the left of the bar. Falls back to the tagline. */
    headline?: string;
    /** Optional right-aligned actions, e.g. a primary call to action. */
    actions?: React.ReactNode;
}

const DEFAULT_HEADLINE = 'A horse management app';

export function AppSidebarHeader({ headline, actions }: AppSidebarHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-header shrink-0 items-center gap-3 border-b border-border bg-surface px-content">
            {/* Always available on mobile; on desktop it appears only once the
                sidebar has collapsed, since the sidebar's own trigger is
                hidden at icon width. */}
            <SidebarTrigger className="-ml-1 flex text-subtle-foreground hover:text-foreground md:hidden md:group-has-data-[collapsible=icon]/sidebar-wrapper:flex" />
            <span className="truncate text-[0.9375rem] font-bold tracking-tight text-foreground">{headline ?? DEFAULT_HEADLINE}</span>
            {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
    );
}
