import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    /** Optional right-aligned actions (buttons, filters). */
    actions?: React.ReactNode;
    className?: string;
}

/**
 * The title block at the top of a page's content canvas.
 */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
