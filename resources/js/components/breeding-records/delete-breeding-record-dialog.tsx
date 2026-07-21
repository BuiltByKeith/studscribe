import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Trash2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

export function DeleteBreedingRecordDialog({
    recordId,
    stallionName,
    mareName,
}: {
    recordId: number;
    stallionName: string | null;
    mareName: string | null;
}) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const pairLabel = `${stallionName ?? 'this stallion'} and ${mareName ?? 'this mare'}`;

    const submit = () => {
        destroy(route('breeding-records.destroy', recordId), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructiveGhost" size="icon" className="size-9" aria-label={`Delete breeding record for ${pairLabel}`}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-2">
                    <div className="bg-destructive-tint mb-1 grid size-11 place-items-center rounded-full">
                        <TriangleAlert className="text-destructive size-5" />
                    </div>
                    <DialogTitle>Delete this breeding record?</DialogTitle>
                    <DialogDescription>This permanently removes the breeding record for {pairLabel}. This cannot be undone.</DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-2">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        Delete record
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
