import { Horse } from '@/components/icons/horse';
import { type NavItem } from '@/types';
import { Activity, CalendarCheck, Dna, LayoutGrid, Stethoscope, Syringe, Tags, Truck, UserCog } from 'lucide-react';

/**
 * Primary navigation, shared by the sidebar layout and the header layout so the
 * two cannot drift apart.
 */
export const mainNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutGrid },
    { title: 'Horses', url: '/horses', icon: Horse },
    { title: 'Wellness Monitoring', url: '/monitorings', icon: Activity },
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
 */
export const adminNavItems: NavItem[] = [{ title: 'User Management', url: '/users', icon: UserCog }];

/**
 * The navigation a given user should see.
 */
export function navItemsFor(isAdmin: boolean): NavItem[] {
    return isAdmin ? [...mainNavItems, ...adminNavItems] : mainNavItems;
}
