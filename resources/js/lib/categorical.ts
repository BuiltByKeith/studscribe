/**
 * Colour assignment for categorical badges.
 *
 * Class strings are written out in full rather than composed at runtime --
 * Tailwind scans source text, so `bg-cat-${hue}-tint` would compile to nothing.
 */
export type CatHue = 'blue' | 'pink' | 'violet' | 'indigo' | 'teal' | 'emerald' | 'amber' | 'slate';

export const CAT_CLASSES: Record<CatHue, string> = {
    blue: 'bg-cat-blue-tint text-cat-blue-fg',
    pink: 'bg-cat-pink-tint text-cat-pink-fg',
    violet: 'bg-cat-violet-tint text-cat-violet-fg',
    indigo: 'bg-cat-indigo-tint text-cat-indigo-fg',
    teal: 'bg-cat-teal-tint text-cat-teal-fg',
    emerald: 'bg-cat-emerald-tint text-cat-emerald-fg',
    amber: 'bg-cat-amber-tint text-cat-amber-fg',
    slate: 'bg-cat-slate-tint text-cat-slate-fg',
};

const HUE_CYCLE: CatHue[] = ['blue', 'violet', 'emerald', 'amber', 'indigo', 'teal', 'pink', 'slate'];

/**
 * Stable hue for an arbitrary label.
 *
 * Breeds are user-managed rows, so their colours cannot be hardcoded -- a hue
 * derived from the name keeps a given breed the same colour on every page and
 * still assigns one to breeds added later.
 */
export function hueFor(label: string): CatHue {
    let hash = 0;

    for (let i = 0; i < label.length; i++) {
        hash = (hash * 31 + label.charCodeAt(i)) | 0;
    }

    return HUE_CYCLE[Math.abs(hash) % HUE_CYCLE.length];
}

/**
 * Equine gender terms get fixed hues so the five common ones stay recognisable
 * at a glance. Anything else falls back to the hash.
 */
const GENDER_HUES: Record<string, CatHue> = {
    stallion: 'indigo',
    mare: 'violet',
    gelding: 'slate',
    colt: 'teal',
    filly: 'amber',
};

export function genderHue(gender: string): CatHue {
    return GENDER_HUES[gender.toLowerCase()] ?? hueFor(gender);
}
