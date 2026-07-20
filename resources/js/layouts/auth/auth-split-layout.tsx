import AppBrand from '@/components/app-brand';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center bg-background px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* The brand gradient carries the left panel, so the panel rethemes
                with --brand-gradient rather than a hardcoded fill. */}
            <div className="bg-brand-gradient relative hidden h-full flex-col p-10 text-primary-foreground lg:flex">
                {/* No brand tile here -- the panel is already the gradient, so
                    the wordmark alone reads better than a tile on top of it. */}
                <Link href={route('home')} className="relative z-20 text-lg font-bold tracking-tight">
                    {name}
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
                            <footer className="text-sm opacity-80">{quote.author}</footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center gap-2.5 lg:hidden">
                        <AppBrand name={name} />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
