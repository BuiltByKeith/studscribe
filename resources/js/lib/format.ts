/** Shown wherever a value is absent, so blank cells never look like a bug. */
export const EMPTY = '—';

/**
 * Age from a date of birth, in the way horse people say it.
 *
 * Under a year reads in months, because "0 yrs" is useless for a foal.
 */
export function formatAge(birthDate: string | null): string {
    if (!birthDate) {
        return EMPTY;
    }

    const born = new Date(birthDate);

    if (Number.isNaN(born.getTime())) {
        return EMPTY;
    }

    const now = new Date();
    let months = (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());

    if (now.getDate() < born.getDate()) {
        months -= 1;
    }

    if (months < 0) {
        return EMPTY;
    }

    if (months < 12) {
        return `${months} mo`;
    }

    const years = Math.floor(months / 12);

    return `${years} yr${years === 1 ? '' : 's'}`;
}

/**
 * Breed percentage as a percentage. Trailing `.00` is dropped so the common
 * case reads "100%" rather than "100.00%".
 */
export function formatPercent(value: string | number | null): string {
    if (value === null || value === '') {
        return EMPTY;
    }

    const numeric = typeof value === 'number' ? value : Number.parseFloat(value);

    if (Number.isNaN(numeric)) {
        return EMPTY;
    }

    return `${Number.isInteger(numeric) ? numeric : Number.parseFloat(numeric.toFixed(2))}%`;
}

/**
 * Readable date, e.g. "May 4, 2019".
 *
 * The locale is pinned to en-US rather than left to the browser: month-day-year
 * is the requested order, and an unpinned locale would silently reorder it for
 * anyone whose machine is set to en-GB.
 */
export function formatDate(value: string | null): string {
    if (!value) {
        return EMPTY;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return EMPTY;
    }

    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Compact date for dense table cells, e.g. "May 4, 2019". */
export function formatDateShort(value: string | null): string {
    if (!value) {
        return EMPTY;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return EMPTY;
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * A measurement with its unit, or an em dash when absent.
 *
 * `0` is a legitimate reading, so the check is explicitly against null and
 * empty rather than falsiness.
 */
export function formatMeasure(value: string | number | null, unit: string, decimals = 1): string {
    if (value === null || value === '') {
        return EMPTY;
    }

    const numeric = typeof value === 'number' ? value : Number.parseFloat(value);

    if (Number.isNaN(numeric)) {
        return EMPTY;
    }

    const rounded = Number.isInteger(numeric) ? numeric : Number.parseFloat(numeric.toFixed(decimals));

    return `${rounded} ${unit}`;
}

/** Any nullable text field, with the em dash fallback. */
export function orEmpty(value: string | null | undefined): string {
    return value === null || value === undefined || value.trim() === '' ? EMPTY : value;
}
