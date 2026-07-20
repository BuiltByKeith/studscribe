import { cn } from '@/lib/utils';
import { useCallback, useId, useRef, useState } from 'react';

export interface TabDefinition {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    /** Shown as a count pill beside the label. */
    badge?: number;
}

interface TabsProps {
    tabs: TabDefinition[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

/**
 * Tab strip.
 *
 * Hand-rolled rather than pulling in @radix-ui/react-tabs for a single surface.
 * It implements the parts that matter: roving focus with arrow keys, Home/End,
 * and the aria wiring that ties each tab to its panel.
 */
export function TabList({ tabs, value, onValueChange, className }: TabsProps) {
    const baseId = useId();
    const listRef = useRef<HTMLDivElement>(null);

    const onKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

            if (!keys.includes(event.key)) {
                return;
            }

            event.preventDefault();

            const index = tabs.findIndex((tab) => tab.value === value);
            let next = index;

            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;

            onValueChange(tabs[next].value);
            listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
        },
        [tabs, value, onValueChange],
    );

    return (
        // Scrolls horizontally on narrow screens rather than wrapping to a
        // second row, which would shift the panel down as tabs reflow.
        <div className={cn('overflow-x-auto', className)}>
            <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className="flex w-max min-w-full items-center justify-center gap-1 p-1.5">
                {tabs.map((tab) => {
                    const active = tab.value === value;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            role="tab"
                            id={`${baseId}-tab-${tab.value}`}
                            aria-selected={active}
                            aria-controls={`${baseId}-panel-${tab.value}`}
                            tabIndex={active ? 0 : -1}
                            onClick={() => onValueChange(tab.value)}
                            className={cn(
                                'inline-flex shrink-0 items-center gap-2 rounded-nav px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all',
                                'focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-hidden',
                                active
                                    ? 'bg-brand-gradient text-primary-foreground shadow-brand'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                        >
                            {Icon && <Icon className="size-4 shrink-0" />}
                            {tab.label}
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span
                                    className={cn(
                                        'rounded-full px-1.5 py-0.5 text-[0.6875rem] leading-none font-bold tabular-nums',
                                        active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Panel body paired with a TabList entry. */
export function TabPanel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div role="tabpanel" className={cn('animate-in fade-in-0 slide-in-from-bottom-1 duration-200', className)}>
            {children}
        </div>
    );
}

/** Consistent "nothing here yet" body for a tab with no data. */
export function TabEmpty({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted text-subtle-foreground">
                <Icon className="size-5" />
            </span>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export function useTabs(initial: string) {
    return useState(initial);
}
