import { toast } from '@/lib/toast';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Bridges Laravel's flashed `success`/`error` session messages into a toast.
 *
 * Every CRUD controller in the app already does `back()->with('success', ...)`
 * or `->with('error', ...)` on redirect -- this is the one place that turns
 * that into something visible, so no controller had to change.
 */
export function FlashToasts() {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.error]);

    return null;
}
