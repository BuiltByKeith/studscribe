import { DetailGrid, DetailRow } from '@/components/detail-row';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { EMPTY, formatDateShort, formatMeasure, orEmpty } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type MonitoringRow } from '@/types';
import { HeartPulse, Ruler, Star, StickyNote, Thermometer, UserRound, Weight, Wind } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';
const SCORE_MAX = 10;

function ConditionScore({ score }: { score: number | null }) {
    if (score === null) {
        return <span className="text-muted-foreground">{EMPTY}</span>;
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5" title={`${score} out of ${SCORE_MAX}`}>
            <div className="flex flex-wrap items-center gap-px" aria-hidden="true">
                {Array.from({ length: SCORE_MAX }, (_, index) => (
                    <Star key={index} className={cn('size-3 shrink-0', index < score ? 'fill-primary text-primary' : 'fill-muted text-muted')} />
                ))}
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                {score}/{SCORE_MAX}
            </span>
        </div>
    );
}

/**
 * Read-only detail popup for a single monitoring reading.
 *
 * A single controlled instance lives at the page level rather than one per
 * row -- the row click sets `monitoring` to the clicked record, so only ever
 * one of these is mounted regardless of how many rows the table has.
 */
export function MonitoringDetailsDialog({ monitoring, onOpenChange }: { monitoring: MonitoringRow | null; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={monitoring !== null} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-xl">
                <DialogTitle className="sr-only">Monitoring reading details</DialogTitle>

                {monitoring && (
                    <>
                        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center">
                            <div className="bg-brand-gradient size-20 shrink-0 rounded-full p-[3px] shadow-brand">
                                <div className="size-full rounded-full bg-surface p-1">
                                    <img
                                        src={monitoring.horse_image ?? PLACEHOLDER_IMAGE}
                                        alt={monitoring.horse_name ?? ''}
                                        className="size-full rounded-full bg-muted object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-foreground">{orEmpty(monitoring.horse_name)}</h3>
                                <p className="text-sm text-muted-foreground">{formatDateShort(monitoring.monitoring_date)}</p>
                            </div>
                        </div>

                        <div className="max-h-[55vh] overflow-y-auto px-6 pb-2">
                            <DetailGrid className="sm:grid-cols-3">
                                <DetailRow icon={Ruler} label="Height">
                                    {formatMeasure(monitoring.height, 'cm')}
                                </DetailRow>
                                <DetailRow icon={Weight} label="Weight">
                                    {formatMeasure(monitoring.weight, 'kg')}
                                </DetailRow>
                                <DetailRow icon={Thermometer} label="Temperature">
                                    {formatMeasure(monitoring.temperature, '°C')}
                                </DetailRow>
                                <DetailRow icon={HeartPulse} label="Heart Rate">
                                    {formatMeasure(monitoring.heart_rate, 'bpm', 0)}
                                </DetailRow>
                                <DetailRow icon={Wind} label="Respiratory Rate">
                                    {formatMeasure(monitoring.respiratory_rate, 'br/min', 0)}
                                </DetailRow>
                                <DetailRow icon={Star} label="Condition Score">
                                    <ConditionScore score={monitoring.condition_score} />
                                </DetailRow>
                                <DetailRow icon={UserRound} label="Checked By" className="sm:col-span-3">
                                    {orEmpty(monitoring.checked_by)}
                                </DetailRow>
                                <DetailRow icon={StickyNote} label="Notes" className="sm:col-span-3">
                                    {monitoring.notes ?? <span className="text-muted-foreground">{EMPTY}</span>}
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
