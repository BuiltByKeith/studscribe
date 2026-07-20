import { createLucideIcon } from 'lucide-react';

/**
 * Horse head in profile.
 *
 * Lucide ships no horse icon, so this is built with lucide's own factory rather
 * than as a hand-rolled SVG component. That makes it a real `LucideIcon` -- same
 * type, same props, same 24x24 grid and 2px stroke -- so it drops into the nav
 * config beside the stock icons and inherits size and colour from the sidebar's
 * existing `[&>svg]` rules with no special casing.
 *
 * Drawn as a bold silhouette rather than a detailed outline: nav icons render at
 * 16px, where fine interior detail turns to mush.
 */
export const Horse = createLucideIcon('Horse', [
    [
        'path',
        {
            d: 'M5 21c0-5.5 1.5-9 4.5-11C8.2 8.6 7.8 6.8 8.2 5L11 7.5c.6-.4 1.3-.7 2-.9L13.5 3.5 16 6.5c3 1.5 5 4 5 6.7 0 1.5-1.1 2.4-2.6 2.4H15c-2 1-3 2.8-3.2 5.4',
            key: 'horse-head',
        },
    ],
    ['path', { d: 'M16.5 10.5h.01', key: 'horse-eye' }],
]);

export default Horse;
