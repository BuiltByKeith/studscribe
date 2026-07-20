import { AddBreedDialog, EditBreedDialog } from '@/components/breeds/breed-form-dialog';
import { DeleteBreedDialog } from '@/components/breeds/delete-breed-dialog';
import { DataTablePagination } from '@/components/data-table-pagination';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type BreedRow, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';

const COLUMNS = ['Breed Name', 'Description', 'Actions'];

export default function BreedsIndex({ breeds }: { breeds: Paginated<BreedRow> }) {
    return (
        <AppLayout>
            <Head title="Breeds" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Breeds"
                    description="The breed list horses are classified against."
                    actions={<AddBreedDialog />}
                />

                <div className="overflow-hidden rounded-popover border border-border bg-surface shadow-card">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                {COLUMNS.map((column) => (
                                    <TableHead key={column} className={column === 'Actions' ? 'text-right' : undefined}>
                                        {column}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {breeds.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No breeds recorded yet.</TableEmpty>
                            ) : (
                                breeds.data.map((breed) => (
                                    <TableRow key={breed.id}>
                                        <TableCell className="font-semibold whitespace-nowrap text-foreground">{breed.name}</TableCell>
                                        <TableCell>
                                            <span className="block max-w-md truncate text-muted-foreground" title={breed.description ?? undefined}>
                                                {orEmpty(breed.description)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <EditBreedDialog breed={breed} />
                                                <DeleteBreedDialog breedId={breed.id} breedName={breed.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={breeds} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
