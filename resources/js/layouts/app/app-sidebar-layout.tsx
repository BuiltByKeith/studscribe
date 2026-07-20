import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { FlashToasts } from '@/components/flash-toasts';
import { Toaster } from '@/components/toaster';
import { type AppLayoutProps } from '@/types';

export default function AppSidebarLayout({ children, headline, headerActions }: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader headline={headline} actions={headerActions} />
                {children}
            </AppContent>
            <FlashToasts />
            <Toaster />
        </AppShell>
    );
}
