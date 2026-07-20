import { Button } from '@/components/ui/button';
import { compressImage, formatBytes } from '@/lib/compress-image';
import { cn } from '@/lib/utils';
import { ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ACCEPT = 'image/jpeg,image/png,image/webp';

interface ImageUploadProps {
    id: string;
    /** Called with the compressed file, or null when cleared. */
    onChange: (file: File | null) => void;
    disabled?: boolean;
    className?: string;
}

interface Preview {
    url: string;
    originalBytes: number;
    compressedBytes: number;
    width: number;
    height: number;
    skipped: boolean;
}

/**
 * Round image picker with a live preview and client-side compression.
 *
 * The preview is a circle because that is how the photo is rendered in the
 * horses table -- showing a square crop here would let someone pick an image
 * that looks fine in the form and gets its subject cut off in the list.
 */
export function ImageUpload({ id, onChange, disabled = false, className }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [working, setWorking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Object URLs are leaked memory until revoked, so tie each one's lifetime
    // to the preview that owns it.
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview.url);
            }
        };
    }, [preview]);

    const handleFile = async (file: File | undefined) => {
        if (!file) {
            return;
        }

        setError(null);
        setWorking(true);

        try {
            const result = await compressImage(file);

            setPreview((current) => {
                if (current) {
                    URL.revokeObjectURL(current.url);
                }

                return {
                    url: URL.createObjectURL(result.file),
                    originalBytes: result.originalBytes,
                    compressedBytes: result.compressedBytes,
                    width: result.width,
                    height: result.height,
                    skipped: result.skipped,
                };
            });

            onChange(result.file);
        } catch {
            setError('That image could not be read. Try a JPEG, PNG, or WebP.');
            onChange(null);
        } finally {
            setWorking(false);
        }
    };

    const clear = () => {
        setPreview((current) => {
            if (current) {
                URL.revokeObjectURL(current.url);
            }

            return null;
        });

        setError(null);
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const saved = preview && !preview.skipped ? Math.round((1 - preview.compressedBytes / preview.originalBytes) * 100) : 0;

    return (
        <div className={cn('flex items-center gap-4', className)}>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || working}
                aria-label={preview ? 'Replace photo' : 'Upload photo'}
                className={cn(
                    'group relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/50 transition-colors',
                    'hover:border-primary hover:bg-primary-tint focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-hidden',
                    preview && 'border-solid border-border',
                    (disabled || working) && 'pointer-events-none opacity-60',
                )}
            >
                {preview ? (
                    <img src={preview.url} alt="Selected horse" className="size-full object-cover" />
                ) : (
                    <ImagePlus className="size-6 text-subtle-foreground transition-colors group-hover:text-primary" />
                )}

                {working && (
                    <span className="absolute inset-0 grid place-items-center bg-surface/70">
                        <LoaderCircle className="size-5 animate-spin text-primary" />
                    </span>
                )}
            </button>

            <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={disabled || working}>
                        {preview ? 'Replace' : 'Upload photo'}
                    </Button>

                    {preview && (
                        <Button type="button" variant="destructiveGhost" size="sm" onClick={clear} disabled={disabled || working}>
                            <Trash2 className="size-3.5" />
                            Remove
                        </Button>
                    )}
                </div>

                {error ? (
                    <p className="text-xs font-medium text-destructive">{error}</p>
                ) : preview ? (
                    <p className="text-xs text-muted-foreground">
                        {preview.skipped ? (
                            <>Kept original &middot; {formatBytes(preview.originalBytes)}</>
                        ) : (
                            <>
                                {preview.width}&times;{preview.height} &middot; {formatBytes(preview.originalBytes)} &rarr;{' '}
                                <span className="font-medium text-success">{formatBytes(preview.compressedBytes)}</span>
                                {saved > 0 && <> ({saved}% smaller)</>}
                            </>
                        )}
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Resized and compressed automatically.</p>
                )}
            </div>

            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                disabled={disabled || working}
                onChange={(event) => handleFile(event.target.files?.[0])}
            />
        </div>
    );
}
