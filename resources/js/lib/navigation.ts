import { Horse } from '@/components/icons/horse';
import { type NavItem } from '@/types';
import {
    Activity,
    CalendarCheck,
    Dna,
    Heart,
    KeyRound,
    LayoutGrid,
    ShieldCheck,
    Stethoscope,
    Syringe,
    Tags,
    Truck,
    UserCog,
    Users,
} from 'lucide-react';

/**
 * Primary navigation, shared by the sidebar layout and the header layout so the
 * two cannot drift apart.
 */
export const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'Horses', url: '/horses', icon: Horse },
    { title: 'Wellness Monitoring', url: '/monitorings', icon: Activity },
    { title: 'Breeding Records', url: '/breeding-records', icon: Heart },
    { title: 'Vaccination Monitoring', url: '/vaccinations', icon: CalendarCheck },
    { title: 'Medical Records', url: '/medical-records', icon: Stethoscope },
    { title: 'Breeds', url: '/breeds', icon: Dna },
    { title: 'Genders', url: '/genders', icon: Tags },
    { title: 'Suppliers', url: '/suppliers', icon: Truck },
    { title: 'Vaccines', url: '/vaccines', icon: Syringe },
];

/**
 * Shown only to admins. Hiding these is cosmetic -- the routes are guarded
 * server-side by the `admin` gate, so a non-admin who types the URL gets a 403.
 *
 * "User Management" itself links to `/users` and expands into its three
 * sub-areas -- the parent stays a real link so it still works from the
 * header nav, which does not render submenus.
 */
export const adminNavItems: NavItem[] = [
    {
        title: 'User Management',
        url: '/users',
        icon: UserCog,
        items: [
            { title: 'Users', url: '/users', icon: Users },
            { title: 'Roles', url: '/roles', icon: ShieldCheck },
            { title: 'Permissions', url: '/permissions', icon: KeyRound },
        ],
    },
];

/**
 * The navigation a given user should see.
 */
export function navItemsFor(isAdmin: boolean): NavItem[] {
    return isAdmin ? [...mainNavItems, ...adminNavItems] : mainNavItems;
}
