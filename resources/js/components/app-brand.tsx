import { cn } from '@/lib/utils';

/**
 * The product logo. Lives in `public/`, so it is referenced by absolute URL
 * rather than imported -- Vite does not fingerprint files served from there.
 */
const LOGO_SRC = '/images/studscribe-logo.png';

interface AppBrandProps {
    /** Product name shown next to the mark. Defaults to the configured app name. */
    name?: string;
    /** Override the logo image. */
    logoSrc?: string;
    /** Hide the wordmark and render the mark alone (collapsed sidebar, auth screens). */
    markOnly?: boolean;
    className?: string;
}

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * The product mark: the logo tile, optionally followed by the wordmark.
 * Tile size and radius come from --brand-tile-size and --radius-brand-tile in
 * globals.css, so the mark stays in step with the rest of the chrome.
 */
export default function AppBrand({ name = APP_NAME, logoSrc = LOGO_SRC, markOnly = false, className }: AppBrandProps) {
    return (
        <>
            <div className={cn('size-brand-tile shrink-0 overflow-hidden rounded-brand shadow-brand', className)}>
                {/* The source PNG has roughly 14% transparent padding around
                    the artwork. Scaling up inside an overflow-hidden box crops
                    that padding so the mark fills the tile like the rest of the
                    chrome expects. */}
                <img src={logoSrc} alt={`${name} logo`} className="size-full scale-[1.30] object-cover" loading="eager" decoding="async" />
            </div>
            {!markOnly && (
                <div className="grid flex-1 text-left">
                    <span className="truncate text-[0.9375rem] font-bold leading-none tracking-normal text-foreground">{name}</span>
                </div>
            )}
        </>
    );
}
