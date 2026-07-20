import AppBrand from '@/components/app-brand';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2.5 self-center">
                    <AppBrand />
                </Link>

                <Card>
                    <CardHeader className="px-10 pt-8 pb-0 text-center">
                        <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
