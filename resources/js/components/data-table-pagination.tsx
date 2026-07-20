import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Paginated } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination for a Laravel paginator delivered through Inertia.
 *
 * Server-side: every control is a link to a real `?page=` URL, so the browser
 * back button and a copied URL both land on the right page. Nothing is sliced
 * client-side.
 */
export function DataTablePagination<T>({ paginator, className }: { paginator: Paginated<T>; className?: string }) {
    const { from, to, total, links, prev_page_url, next_page_url } = paginator;

    // Laravel puts "Previous" first and "Next" last in `links`; those are
    // rendered as dedicated arrow buttons, so drop them from the number run.
    const numberLinks = links.slice(1, -1);

    if (total === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col items-center justify-between gap-4 sm:flex-row', className)}>
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{from ?? 0}</span>–
                <span className="font-medium text-foreground">{to ?? 0}</span> of{' '}
                <span className="font-medium text-foreground">{total}</span>
            </p>

            <nav className="flex items-center gap-1" aria-label="Pagination">
                <PageArrow url={prev_page_url} label="Previous page">
                    <ChevronLeft className="size-4" />
                </PageArrow>

                {numberLinks.map((link, index) =>
                    link.url === null ? (
                        // Laravel emits "..." as a null-url separator.
                        <span key={`gap-${index}`} className="px-2 text-sm text-muted-foreground">
                            &hellip;
                        </span>
                    ) : (
                        <Button
                            key={link.label}
                            asChild
                            size="icon"
                            variant={link.active ? 'default' : 'ghost'}
                            className={cn('size-9 text-sm', link.active && 'pointer-events-none')}
                        >
                            <Link href={link.url} preserveScroll aria-current={link.active ? 'page' : undefined}>
                                {link.label}
                            </Link>
                        </Button>
                    ),
                )}

                <PageArrow url={next_page_url} label="Next page">
                    <ChevronRight className="size-4" />
                </PageArrow>
            </nav>
        </div>
    );
}

function PageArrow({ url, label, children }: { url: string | null; label: string; children: React.ReactNode }) {
    if (!url) {
        return (
            <Button size="icon" variant="ghost" className="size-9" disabled aria-label={label}>
                {children}
            </Button>
        );
    }

    return (
        <Button asChild size="icon" variant="ghost" className="size-9">
            <Link href={url} preserveScroll aria-label={label}>
                {children}
            </Link>
        </Button>
    );
}
