export type ToastVariant = 'success' | 'error' | 'warning';

export interface ToastItem {
    id: number;
    variant: ToastVariant;
    message: string;
}

type Listener = (toasts: ToastItem[]) => void;

/** Auto-dismiss delay. Long enough to read, short enough not to pile up. */
const DURATION_MS = 4000;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];
let nextId = 0;

function emit() {
    listeners.forEach((listener) => listener(toasts));
}

function push(variant: ToastVariant, message: string) {
    const id = ++nextId;
    toasts = [...toasts, { id, variant, message }];
    emit();

    setTimeout(() => dismiss(id), DURATION_MS);
}

export function dismiss(id: number) {
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
}

/**
 * Fire a toast from anywhere -- no provider or hook needed at the call site.
 * `Toaster` is the sole subscriber and owns the actual rendering.
 */
export const toast = {
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    warning: (message: string) => push('warning', message),
};

/** Used only by `Toaster` itself to stay in sync with the module-level list. */
export function subscribeToToasts(listener: Listener): () => void {
    listeners.push(listener);
    listener(toasts);

    return () => {
        listeners = listeners.filter((existing) => existing !== listener);
    };
}
