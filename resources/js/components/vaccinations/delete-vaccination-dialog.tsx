import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, TriangleAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteVaccinationDialog({ vaccinationId, horseName }: { vaccinationId: number; horseName: string | null }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = () => {
        destroy(route('vaccinations.destroy', vaccinationId), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructiveGhost" size="icon" className="size-9" aria-label={`Delete vaccination for ${horseName ?? 'this horse'}`}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-2">
                    <div className="mb-1 grid size-11 place-items-center rounded-full bg-destructive-tint">
                        <TriangleAlert className="size-5 text-destructive" />
                    </div>
                    <DialogTitle>Delete this vaccination?</DialogTitle>
                    <DialogDescription>
                        This permanently removes this vaccination record for {horseName ?? 'this horse'}. This cannot be undone.
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
                        Delete vaccination
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
