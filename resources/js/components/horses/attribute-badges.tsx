import { EMPTY } from '@/lib/format';
import { CAT_CLASSES, genderHue, hueFor } from '@/lib/categorical';
import { cn } from '@/lib/utils';
import { Dna, Mars, Venus } from 'lucide-react';

const BASE = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap';

/** Blue for male, pink for female, with the matching planetary glyph. */
export function SexBadge({ sex }: { sex: 'male' | 'female' | null }) {
    if (!sex) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    const isMale = sex === 'male';

    return (
        <span className={cn(BASE, CAT_CLASSES[isMale ? 'blue' : 'pink'])}>
            {isMale ? <Mars className="size-3.5" /> : <Venus className="size-3.5" />}
            {isMale ? 'Male' : 'Female'}
        </span>
    );
}

/** Stallion, Mare, Gelding, Colt, Filly each carry a fixed hue. */
export function GenderBadge({ gender }: { gender: string | null }) {
    if (!gender) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return <span className={cn(BASE, CAT_CLASSES[genderHue(gender)])}>{gender}</span>;
}

/**
 * Breed hue is derived from the name so breeds added later still get a colour.
 * The icon stays constant -- breed is a genetic classification, and a different
 * glyph per breed would be decoration with no meaning behind it.
 */
export function BreedBadge({ breed }: { breed: string | null }) {
    if (!breed) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <span className={cn(BASE, CAT_CLASSES[hueFor(breed)])}>
            <Dna className="size-3.5 shrink-0" />
            {breed}
        </span>
    );
}
