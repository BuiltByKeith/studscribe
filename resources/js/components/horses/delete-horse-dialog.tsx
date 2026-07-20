import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, TriangleAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Delete confirmation for a horse.
 *
 * The warning is specific about the cascade because it is not recoverable:
 * horses have no soft delete, and the monitorings, medical records, and
 * vaccinations attached to one go with it.
 */
export function DeleteHorseDialog({ horseId, horseName }: { horseId: number; horseName: string }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = () => {
        destroy(route('horses.destroy', horseId), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructiveGhost" size="icon" className="size-9" aria-label={`Delete ${horseName}`}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-2">
                    <div className="mb-1 grid size-11 place-items-center rounded-full bg-destructive-tint">
                        <TriangleAlert className="size-5 text-destructive" />
                    </div>
                    <DialogTitle>Delete {horseName}?</DialogTitle>
                    <DialogDescription>
                        This permanently deletes {horseName} along with every monitoring reading, medical record, and vaccination attached to it.
                        This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-2">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        Delete horse
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
