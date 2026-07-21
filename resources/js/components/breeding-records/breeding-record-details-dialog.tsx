import { DetailGrid, DetailRow } from '@/components/detail-row';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreedingRecordRow } from '@/types';
import { CalendarHeart, Heart, StickyNote } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

/** Photo ring for the pair header -- blue for the stallion, pink for the mare. */
function HorseAvatar({ image, name, tone }: { image: string | null; name: string | null; tone: 'stallion' | 'mare' }) {
    return (
        <div
            className={cn(
                'size-16 shrink-0 rounded-full bg-gradient-to-br p-[3px]',
                tone === 'stallion' ? 'from-blue-400 to-blue-600' : 'from-pink-400 to-pink-600',
            )}
        >
            <div className="bg-surface size-full rounded-full p-1">
                <img src={image ?? PLACEHOLDER_IMAGE} alt={name ?? ''} className="bg-muted size-full rounded-full object-cover" />
            </div>
        </div>
    );
}

function CycleGroup({
    ordinal,
    date,
    day21Date,
    notes,
    hasDay21,
    divider,
}: {
    ordinal: string;
    date: string | null;
    day21Date: string | null;
    notes: string | null;
    hasDay21: boolean;
    divider: boolean;
}) {
    return (
        <section className={cn('space-y-3', divider && 'border-border border-t pt-6')}>
            <h4 className="group-label">{ordinal} Cycle</h4>

            <DetailGrid className={hasDay21 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}>
                <DetailRow icon={CalendarHeart} label="Cycle Date">
                    {formatDateShort(date)}
                </DetailRow>
                {hasDay21 && (
                    <DetailRow icon={CalendarHeart} label="21st Day">
                        {formatDateShort(day21Date)}
                    </DetailRow>
                )}
            </DetailGrid>

            <div className="rounded-popover border-border bg-surface border px-5 py-4">
                <p className="group-label mb-2 flex items-center gap-1.5">
                    <StickyNote className="size-3.5" />
                    Notes
                </p>
                <p className="text-foreground text-sm whitespace-pre-wrap">{notes ?? <span className="text-muted-foreground">{EMPTY}</span>}</p>
            </div>
        </section>
    );
}

/**
 * Read-only detail popup for a single breeding record.
 *
 * A single controlled instance lives at the page level rather than one per
 * row, mirroring the monitoring/medical-record detail dialogs.
 */
export function BreedingRecordDetailsDialog({ record, onOpenChange }: { record: BreedingRecordRow | null; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={record !== null} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-xl">
                <DialogTitle className="sr-only">Breeding record details</DialogTitle>

                {record && (
                    <>
                        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-2 text-center">
                            <div className="flex items-center gap-3">
                                <HorseAvatar image={record.stallion_image} name={record.stallion_name} tone="stallion" />
                                <Heart className="size-5 shrink-0 fill-rose-500 text-rose-500" aria-hidden="true" />
                                <HorseAvatar image={record.mare_image} name={record.mare_name} tone="mare" />
                            </div>

                            <div>
                                <h3 className="text-foreground text-lg font-bold tracking-tight">
                                    {orEmpty(record.stallion_name)} &amp; {orEmpty(record.mare_name)}
                                </h3>
                                <p className="text-muted-foreground text-sm">Last breeding: {formatDateShort(record.last_breeding_date)}</p>
                            </div>
                        </div>

                        <div className="max-h-[55vh] space-y-6 overflow-y-auto px-6 pb-2">
                            <CycleGroup
                                ordinal="1st"
                                date={record.cycle_1_date}
                                day21Date={record.cycle_1_day21_date}
                                notes={record.cycle_1_notes}
                                hasDay21
                                divider={false}
                            />
                            <CycleGroup
                                ordinal="2nd"
                                date={record.cycle_2_date}
                                day21Date={record.cycle_2_day21_date}
                                notes={record.cycle_2_notes}
                                hasDay21
                                divider
                            />
                            <CycleGroup
                                ordinal="3rd"
                                date={record.cycle_3_date}
                                day21Date={record.cycle_3_day21_date}
                                notes={record.cycle_3_notes}
                                hasDay21
                                divider
                            />
                            <CycleGroup
                                ordinal="4th"
                                date={record.cycle_4_date}
                                day21Date={null}
                                notes={record.cycle_4_notes}
                                hasDay21={false}
                                divider
                            />
                        </div>

                        <DialogFooter className="border-border border-t">
                            <DialogClose asChild>
                                <Button variant="secondary">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
