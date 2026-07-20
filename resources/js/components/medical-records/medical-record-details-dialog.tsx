import { DetailGrid, DetailRow } from '@/components/detail-row';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { EMPTY, formatDateShort, orEmpty } from '@/lib/format';
import { type MedicalRecordRow } from '@/types';
import { ClipboardList, StickyNote, Stethoscope, UserRound } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

/** Read-only detail popup for a single medical record. See MonitoringDetailsDialog for the controlled-instance pattern. */
export function MedicalRecordDetailsDialog({ record, onOpenChange }: { record: MedicalRecordRow | null; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={record !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogTitle className="sr-only">Medical record details</DialogTitle>

                {record && (
                    <>
                        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center">
                            <div className="bg-brand-gradient size-20 shrink-0 rounded-full p-[3px] shadow-brand">
                                <div className="size-full rounded-full bg-surface p-1">
                                    <img
                                        src={record.horse_image ?? PLACEHOLDER_IMAGE}
                                        alt={record.horse_name ?? ''}
                                        className="size-full rounded-full bg-muted object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-foreground">{orEmpty(record.horse_name)}</h3>
                                <p className="text-sm text-muted-foreground">{formatDateShort(record.visit_date)}</p>
                            </div>
                        </div>

                        <div className="max-h-[55vh] overflow-y-auto px-6 pb-2">
                            <DetailGrid>
                                <DetailRow icon={UserRound} label="Veterinarian" className="sm:col-span-2">
                                    {orEmpty(record.veterinarian)}
                                </DetailRow>
                                <DetailRow icon={Stethoscope} label="Diagnosis" className="sm:col-span-2">
                                    {record.diagnosis ?? <span className="text-muted-foreground">{EMPTY}</span>}
                                </DetailRow>
                                <DetailRow icon={ClipboardList} label="Treatment" className="sm:col-span-2">
                                    {record.treatment ?? <span className="text-muted-foreground">{EMPTY}</span>}
                                </DetailRow>
                                <DetailRow icon={StickyNote} label="Notes" className="sm:col-span-2">
                                    {record.notes ?? <span className="text-muted-foreground">{EMPTY}</span>}
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
