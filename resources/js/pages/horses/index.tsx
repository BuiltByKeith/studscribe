import { DataTablePagination } from '@/components/data-table-pagination';
import { AddHorseDialog } from '@/components/horses/add-horse-dialog';
import { BreedBadge, GenderBadge, SexBadge } from '@/components/horses/attribute-badges';
import { DeleteHorseDialog } from '@/components/horses/delete-horse-dialog';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import { EMPTY, formatAge, formatPercent, orEmpty } from '@/lib/format';
import AppLayout from '@/layouts/app-layout';
import { type HorseFormOptions, type HorseRow, type Paginated } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

const COLUMNS = [
    'Horse',
    'Age',
    'Sex',
    'Gender',
    'Sire',
    'Dam',
    'Breed',
    'Breed %',
    'Supplier',
    'Color',
    'Registration No.',
    'Actions',
];

export default function HorsesIndex({ horses, options }: { horses: Paginated<HorseRow>; options: HorseFormOptions }) {
    const getInitials = useInitials();

    return (
        <AppLayout>
            <Head title="Horses" />

            <div className="flex flex-1 flex-col gap-6 p-content">
                <PageHeader
                    title="Horses"
                    description="Every horse on the farm, with its pedigree, breed, and acquisition details."
                    actions={<AddHorseDialog options={options} />}
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
                            {horses.data.length === 0 ? (
                                <TableEmpty colSpan={COLUMNS.length}>No horses recorded yet.</TableEmpty>
                            ) : (
                                horses.data.map((horse) => (
                                    <TableRow key={horse.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-10 shrink-0 border border-border">
                                                    <AvatarImage
                                                        src={horse.horse_image ?? PLACEHOLDER_IMAGE}
                                                        alt={horse.horse_name}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback>{getInitials(horse.horse_name)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold whitespace-nowrap text-foreground">{horse.horse_name}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatAge(horse.birth_date)}</TableCell>

                                        <TableCell>
                                            <SexBadge sex={horse.sex} />
                                        </TableCell>

                                        <TableCell>
                                            <GenderBadge gender={horse.gender} />
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(horse.sire)}</TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(horse.dam)}</TableCell>

                                        <TableCell>
                                            <BreedBadge breed={horse.breed} />
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap tabular-nums">{formatPercent(horse.breed_percentage)}</TableCell>

                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(horse.supplier)}</TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">{orEmpty(horse.color)}</TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            {horse.registration_no ? (
                                                <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs tracking-tight text-foreground">
                                                    {horse.registration_no}
                                                </code>
                                            ) : (
                                                <span className="text-muted-foreground">{EMPTY}</span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button asChild variant="ghost" size="icon" className="size-9">
                                                    <Link href={route('horses.show', horse.id)} aria-label={`View ${horse.horse_name}`}>
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteHorseDialog horseId={horse.id} horseName={horse.horse_name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="border-t border-border px-4 py-3">
                        <DataTablePagination paginator={horses} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
