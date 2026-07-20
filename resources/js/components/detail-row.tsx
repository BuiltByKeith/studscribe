import { cn } from '@/lib/utils';

/**
 * Self-contained variant of the horse detail page's facts card, for dropping
 * into a modal body rather than a page section -- it carries its own border
 * and rounding instead of relying on a parent section to supply them.
 */
export function DetailGrid({ children, className }: { children: React.ReactNode; className?: string }) {
    return <dl className={cn('grid gap-px overflow-hidden rounded-popover border border-border bg-border sm:grid-cols-2', className)}>{children}</dl>;
}

interface DetailRowProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    className?: string;
    children: React.ReactNode;
}

/** One labelled fact: icon tile, group-label, value. */
export function DetailRow({ icon: Icon, label, className, children }: DetailRowProps) {
    return (
        <div className={cn('flex min-w-0 items-start gap-3 bg-surface px-5 py-4', className)}>
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" />
            </span>
            <div className="min-w-0 space-y-1">
                <dt className="group-label">{label}</dt>
                <dd className="text-sm font-semibold text-foreground">{children}</dd>
            </div>
        </div>
    );
}
