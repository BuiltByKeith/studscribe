import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function UsersIndex() {
    return (
        <AppLayout>
            <Head title="User Management" />
            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader title="User Management" description="Staff accounts and the roles that govern what each of them can do." />
            </div>
        </AppLayout>
    );
}
