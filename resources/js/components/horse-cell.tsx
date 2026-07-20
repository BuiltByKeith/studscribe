import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { EMPTY } from '@/lib/format';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

/**
 * Photo + name cell, shared by every record table that lists a horse column.
 *
 * These tables span every horse on the farm, so the horse's identity is the
 * anchor of the row -- worth the avatar, unlike the other identifying columns.
 */
export function HorseCell({ name, image }: { name: string | null; image: string | null }) {
    const getInitials = useInitials();

    if (!name) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <div className="flex items-center gap-3">
            <Avatar className="size-8 shrink-0 border border-border">
                <AvatarImage src={image ?? PLACEHOLDER_IMAGE} alt={name} className="object-cover" />
                <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="truncate font-semibold whitespace-nowrap text-foreground">{name}</span>
        </div>
    );
}
