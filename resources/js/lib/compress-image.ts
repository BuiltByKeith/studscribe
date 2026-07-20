export interface CompressOptions {
    /** Longest edge of the output, in pixels. */
    maxEdge?: number;
    /** Encoder quality, 0-1. */
    quality?: number;
    /** Output mime. WebP is used when the browser can encode it. */
    type?: 'image/webp' | 'image/jpeg';
}

export interface CompressResult {
    file: File;
    originalBytes: number;
    compressedBytes: number;
    width: number;
    height: number;
    /** True when compression was skipped because it would not have helped. */
    skipped: boolean;
}

/** Feature-detect WebP encoding once -- Safari < 14 cannot produce it. */
let webpSupported: boolean | null = null;

function canEncodeWebp(): boolean {
    if (webpSupported !== null) {
        return webpSupported;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');

    return webpSupported;
}

/**
 * Downscale and re-encode an image in the browser before upload.
 *
 * This is a bandwidth and storage optimisation, NOT a security control -- the
 * server validates the upload independently, because anyone can post to the
 * endpoint without running this code.
 *
 * Decoding goes through `createImageBitmap` with `imageOrientation: 'from-image'`
 * so EXIF-rotated phone photos come out upright; drawing a raw <img> to canvas
 * discards that metadata and yields sideways horses.
 */
export async function compressImage(file: File, options: CompressOptions = {}): Promise<CompressResult> {
    const { maxEdge = 1600, quality = 0.82 } = options;
    const type = options.type ?? (canEncodeWebp() ? 'image/webp' : 'image/jpeg');

    const originalBytes = file.size;

    let bitmap: ImageBitmap;

    try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
        // Unsupported format or a decode failure -- hand back the original and
        // let server-side validation decide whether it is acceptable.
        return { file, originalBytes, compressedBytes: originalBytes, width: 0, height: 0, skipped: true };
    }

    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
        bitmap.close();

        return { file, originalBytes, compressedBytes: originalBytes, width: 0, height: 0, skipped: true };
    }

    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

    // Re-encoding an already-small or already-optimised image can make it
    // bigger. When that happens, keep the original.
    if (!blob || blob.size >= originalBytes) {
        return { file, originalBytes, compressedBytes: originalBytes, width, height, skipped: true };
    }

    const extension = type === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.replace(/\.[^./\\]+$/, '') || 'photo';

    return {
        file: new File([blob], `${baseName}.${extension}`, { type, lastModified: Date.now() }),
        originalBytes,
        compressedBytes: blob.size,
        width,
        height,
        skipped: false,
    };
}

/** Human-readable byte size for the upload summary. */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
