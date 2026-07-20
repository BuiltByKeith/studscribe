import AppBrand from '@/components/app-brand';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="rounded-popover border border-border bg-surface p-8 shadow-card">
                    <div className="flex flex-col items-center gap-5">
                        <Link href={route('home')} className="flex items-center gap-2.5">
                            <AppBrand />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
