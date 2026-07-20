import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    /** Drives sidebar visibility only -- routes are guarded by the `admin` gate. */
    is_admin: boolean;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface AppLayoutProps {
    children: React.ReactNode;
    /** Context line in the top bar. Defaults to the app name. */
    headline?: string;
    /** Right-aligned actions in the top bar. */
    headerActions?: React.ReactNode;
}

/** One entry in Laravel's paginator `links` array. */
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

/** The shape Laravel's `paginate()` sends through Inertia. */
export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
    path: string;
}

/** A horse as rendered in the index table. */
export interface HorseRow {
    id: number;
    horse_name: string;
    birth_date: string | null;
    sex: 'male' | 'female' | null;
    gender: string | null;
    sire: string | null;
    dam: string | null;
    breed: string | null;
    breed_percentage: string | number | null;
    supplier: string | null;
    color: string | null;
    registration_no: string | null;
    horse_image: string | null;
}

/** Select options for the horse form. */
export interface HorseFormOptions {
    breeds: { id: number; name: string }[];
    genders: { id: number; name: string }[];
    suppliers: { id: number; supplier_name: string }[];
    sires: { id: number; horse_name: string }[];
    dams: { id: number; horse_name: string }[];
}

/** A horse as offered in another record's "which horse" select. */
export interface HorseOption {
    id: number;
    horse_name: string;
}

/** A vaccine as offered in the vaccination form's select. */
export interface VaccineOption {
    id: number;
    name: string;
}

/** A staff member as offered in a "checked by" / "administered by" select. */
export interface UserOption {
    id: number;
    name: string;
}

/** A breed as rendered in the breeds table. */
export interface BreedRow {
    id: number;
    name: string;
    description: string | null;
}

/** A gender term as rendered in the genders table. */
export interface GenderRow {
    id: number;
    name: string;
    sex: 'male' | 'female' | null;
    description: string | null;
}

/** A supplier as rendered in the suppliers table. */
export interface SupplierRow {
    id: number;
    supplier_name: string;
    address: string | null;
    contact: string | null;
    status: 'active' | 'inactive';
}

/** A vaccine as rendered in the vaccines table. */
export interface VaccineRow {
    id: number;
    name: string;
    manufacturer: string | null;
    dose: string | null;
}

/** A monitoring reading as rendered in the wellness monitoring table. */
export interface MonitoringRow {
    id: number;
    horse_id: number;
    horse_name: string | null;
    horse_image: string | null;
    monitoring_date: string | null;
    height: string | number | null;
    weight: string | number | null;
    temperature: string | number | null;
    heart_rate: number | null;
    respiratory_rate: number | null;
    condition_score: number | null;
    checked_by_id: number | null;
    checked_by: string | null;
    notes: string | null;
}

/** A vaccination as rendered in the vaccination monitoring table. */
export interface VaccinationRow {
    id: number;
    horse_id: number;
    horse_name: string | null;
    horse_image: string | null;
    vaccine_id: number;
    vaccine: string | null;
    date_administered: string | null;
    next_due_date: string | null;
    is_overdue: boolean;
    administered_by_id: number | null;
    administered_by: string | null;
    dosage: string | null;
    notes: string | null;
}

/** A medical record as rendered in the medical records table. */
export interface MedicalRecordRow {
    id: number;
    horse_id: number;
    horse_name: string | null;
    horse_image: string | null;
    visit_date: string | null;
    veterinarian: string | null;
    diagnosis: string | null;
    treatment: string | null;
    notes: string | null;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

/** One-shot messages set by a controller redirect, read once then gone. */
export interface Flash {
    success?: string | null;
    error?: string | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: Flash;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    /** Display label under the user's name in the sidebar. Falls back to "User". */
    role?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
