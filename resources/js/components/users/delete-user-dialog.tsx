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

export function DeleteUserDialog({ userId, userName, isSelf }: { userId: number; userName: string; isSelf: boolean }) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = () => {
        destroy(route('users.destroy', userId), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    if (isSelf) {
        return (
            <Button
                variant="destructiveGhost"
                size="icon"
                className="size-9"
                disabled
                aria-label="You cannot delete your own account"
                title="You cannot delete your own account"
            >
                <Trash2 className="size-4" />
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructiveGhost" size="icon" className="size-9" aria-label={`Delete ${userName}`}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-2">
                    <div className="bg-destructive-tint mb-1 grid size-11 place-items-center rounded-full">
                        <TriangleAlert className="text-destructive size-5" />
                    </div>
                    <DialogTitle>Delete {userName}?</DialogTitle>
                    <DialogDescription>This permanently removes {userName}'s account and access. This cannot be undone.</DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-2">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        Delete user
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
