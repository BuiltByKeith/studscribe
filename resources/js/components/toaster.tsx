import { dismiss, subscribeToToasts, type ToastItem, type ToastVariant } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Check, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const VARIANT_ICON: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
    success: Check,
    error: X,
    warning: TriangleAlert,
};

/** Icon tile tint per variant -- the same tint/fg pairs used for status badges elsewhere in the app. */
const VARIANT_TILE: Record<ToastVariant, string> = {
    success: 'bg-success-tint text-success',
    error: 'bg-destructive-tint text-destructive',
    warning: 'bg-cat-amber-tint text-cat-amber-fg',
};

/**
 * Floating toast stack, top-right of the viewport.
 *
 * Mounted once at the layout level. Anything anywhere can fire a toast via
 * `toast.success(...)` / `toast.error(...)` from `@/lib/toast` -- this is the
 * only component that actually renders them.
 */
export function Toaster() {
    const [items, setItems] = useState<ToastItem[]>([]);

    useEffect(() => subscribeToToasts(setItems), []);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
            {items.map((item) => (
                <ToastCard key={item.id} item={item} />
            ))}
        </div>
    );
}

function ToastCard({ item }: { item: ToastItem }) {
    const Icon = VARIANT_ICON[item.variant];

    return (
        <div
            role="status"
            className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-popover border border-border bg-surface p-4 shadow-popover',
                'animate-in fade-in-0 slide-in-from-top-2 zoom-in-95 duration-200',
            )}
        >
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', VARIANT_TILE[item.variant])}>
                <Icon className="size-4" />
            </span>

            <p className="min-w-0 flex-1 pt-1 text-sm font-medium text-foreground">{item.message}</p>

            <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="shrink-0 rounded-md p-1 text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Dismiss notification"
            >
                <X className="size-4" />
            </button>
        </div>
    );
}
