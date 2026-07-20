import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

interface UserInfoProps {
    user: User;
    /** Show the email instead of the role as the secondary line. */
    showEmail?: boolean;
}

export function UserInfo({ user, showEmail = false }: UserInfoProps) {
    const getInitials = useInitials();
    const secondary = showEmail ? user.email : (user.role ?? 'User');

    return (
        <>
            <Avatar className="size-avatar shrink-0 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">{secondary}</span>
            </div>
        </>
    );
}
