import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
    /**
     * Short qualifier rendered inline after the label, e.g. "leave blank if
     * unregistered". Kept on the label line rather than under the control so a
     * hinted field is exactly as tall as an unhinted one and the two columns of
     * a form row stay level.
     */
    hint?: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * Label + control + error, so every field in a form lines up identically and
 * the error slot never shifts the layout when it appears.
 */
export function FormField({ id, label, error, required = false, hint, className, children }: FormFieldProps) {
    return (
        <div className={cn('grid gap-1.5', className)}>
            <Label htmlFor={id} className="flex min-w-0 items-baseline gap-1">
                <span className="shrink-0">
                    {label}
                    {required && (
                        <span className="ml-0.5 text-destructive" aria-hidden="true">
                            *
                        </span>
                    )}
                </span>
                {hint && <span className="truncate text-[0.6875rem] font-normal text-muted-foreground">({hint})</span>}
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}

/** Titled group of related fields inside a longer form. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <div className="space-y-0.5">
                <h3 className="group-label">{title}</h3>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            {children}
        </section>
    );
}
