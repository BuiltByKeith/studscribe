import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, TriangleAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteVaccineDialog({ vaccineId, vaccineName }: { vaccineId: number; vaccineName: string }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = () => {
        destroy(route('vaccines.destroy', vaccineId), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructiveGhost" size="icon" className="size-9" aria-label={`Delete ${vaccineName}`}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-2">
                    <div className="mb-1 grid size-11 place-items-center rounded-full bg-destructive-tint">
                        <TriangleAlert className="size-5 text-destructive" />
                    </div>
                    <DialogTitle>Delete {vaccineName}?</DialogTitle>
                    <DialogDescription>
                        This cannot be undone. A vaccine with doses already administered cannot be deleted -- remove those records first.
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
                        Delete vaccine
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
