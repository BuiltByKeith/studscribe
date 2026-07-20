import { DetailGrid, DetailRow } from '@/components/detail-row';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import { type VaccinationRow } from '@/types';
import { CalendarClock, CalendarPlus, Droplet, StickyNote, UserRound } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

/** Read-only detail popup for a single vaccination record. See MonitoringDetailsDialog for the controlled-instance pattern. */
export function VaccinationDetailsDialog({
    vaccination,
    onOpenChange,
}: {
    vaccination: VaccinationRow | null;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={vaccination !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogTitle className="sr-only">Vaccination details</DialogTitle>

                {vaccination && (
                    <>
                        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center">
                            <div className="bg-brand-gradient size-20 shrink-0 rounded-full p-[3px] shadow-brand">
                                <div className="size-full rounded-full bg-surface p-1">
                                    <img
                                        src={vaccination.horse_image ?? PLACEHOLDER_IMAGE}
                                        alt={vaccination.horse_name ?? ''}
                                        className="size-full rounded-full bg-muted object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-foreground">{orEmpty(vaccination.horse_name)}</h3>
                                <div className="mt-1 flex items-center justify-center gap-2">
                                    <p className="text-sm text-muted-foreground">{orEmpty(vaccination.vaccine)}</p>
                                    {vaccination.is_overdue && (
                                        <span className="rounded-full bg-destructive-tint px-2 py-0.5 text-xs font-semibold text-destructive">
                                            Overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[55vh] overflow-y-auto px-6 pb-2">
                            <DetailGrid>
                                <DetailRow icon={CalendarPlus} label="Date Administered">
                                    {formatDateShort(vaccination.date_administered)}
                                </DetailRow>
                                <DetailRow icon={CalendarClock} label="Next Due Date">
                                    {formatDateShort(vaccination.next_due_date)}
                                </DetailRow>
                                <DetailRow icon={UserRound} label="Administered By">
                                    {orEmpty(vaccination.administered_by)}
                                </DetailRow>
                                <DetailRow icon={Droplet} label="Dosage">
                                    {orEmpty(vaccination.dosage)}
                                </DetailRow>
                                <DetailRow icon={StickyNote} label="Notes" className="sm:col-span-2">
                                    {vaccination.notes ?? <span className="text-muted-foreground">{EMPTY}</span>}
                                </DetailRow>
                            </DetailGrid>
                        </div>

                        <DialogFooter className="border-t border-border">
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
