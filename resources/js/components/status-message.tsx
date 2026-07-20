import { cn } from '@/lib/utils';

/**
 * A positive status message (reset link sent, verification email sent).
 * Uses the success token rather than the brand red, so a success message is
 * never mistaken for an error in a red-accented UI.
 */
export default function StatusMessage({ message, className }: { message?: string; className?: string }) {
    return message ? <div className={cn('mb-4 text-center text-sm font-medium text-success', className)}>{message}</div> : null;
}
