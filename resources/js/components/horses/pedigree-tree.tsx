import { formatAge } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { CircleHelp, Mars, Venus } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/horse-empty-profile.jpg';

export interface PedigreeNode {
    id: number | null;
    horse_name: string;
    horse_image?: string | null;
    sex?: 'male' | 'female' | null;
    breed?: string | null;
    birth_date?: string | null;
    unlinked?: boolean;
    kinship?: string | null;
    ancestors?: AncestorPair | null;
}

export interface AncestorPair {
    sire: PedigreeNode | null;
    dam: PedigreeNode | null;
}

export interface Pedigree {
    root: PedigreeNode;
    ancestors: AncestorPair | null;
    siblings: PedigreeNode[];
    offspring: PedigreeNode[];
}

/** How many ancestor levels actually carry data. */
function ancestorDepth(pair: AncestorPair | null | undefined): number {
    if (!pair) {
        return 0;
    }

    const deeper = Math.max(ancestorDepth(pair.sire?.ancestors), ancestorDepth(pair.dam?.ancestors));

    return 1 + deeper;
}

export function PedigreeTree({ pedigree }: { pedigree: Pedigree }) {
    const depth = ancestorDepth(pedigree.ancestors);

    // Beyond two generations a top-down tree gets tall fast and pushes the
    // siblings row off-screen. Past that point the chart turns on its side and
    // grows rightward instead, which is also how printed pedigrees are drawn.
    const horizontal = depth >= 2;

    return (
        // A minimum height keeps the tabbed card from resizing sharply as you
        // move between tabs, and gives the tree something to centre within.
        <div className="flex min-h-[26rem] flex-col items-center justify-center p-6">
            {depth === 0 ? (
                <UnknownParents />
            ) : horizontal ? (
                <HorizontalPedigree pedigree={pedigree} />
            ) : (
                <VerticalPedigree pedigree={pedigree} />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Vertical: parents on top, subject and siblings below                */
/* ------------------------------------------------------------------ */

function VerticalPedigree({ pedigree }: { pedigree: Pedigree }) {
    const { ancestors, root, siblings } = pedigree;

    return (
        <div className="flex w-full flex-col items-center gap-8">
            {/* Two equal grid columns with the spacing as inner padding rather
                than a gap: that puts each parent's centre at exactly 25% and
                75% of the grid, so the rail below can be inset by a quarter on
                each side and meet both stems without measuring anything. */}
            <div className="grid w-max grid-cols-2">
                <div className="flex flex-col items-center px-4">
                    <ParentSlot node={ancestors?.sire ?? null} role="sire" />
                    <span className="h-6 w-px bg-border" aria-hidden="true" />
                </div>

                <div className="flex flex-col items-center px-4">
                    <ParentSlot node={ancestors?.dam ?? null} role="dam" />
                    <span className="h-6 w-px bg-border" aria-hidden="true" />
                </div>

                {/* Rail joining the two stems, then a drop from its midpoint. */}
                <div className="relative col-span-2 h-8" aria-hidden="true">
                    <span className="absolute top-0 right-1/4 left-1/4 h-px bg-border" />
                    <span className="absolute top-0 left-1/2 h-8 w-px -translate-x-1/2 bg-border" />
                </div>

                <div className="col-span-2 flex justify-center">
                    <HorseCard node={root} emphasis />
                </div>
            </div>

            {siblings.length > 0 && (
                <div className="w-full space-y-3 border-t border-border pt-6">
                    <h4 className="group-label text-center">Siblings</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                        {siblings.map((sibling) => (
                            <HorseCard key={sibling.id} node={sibling} muted />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Horizontal: generations as columns, oldest on the right             */
/* ------------------------------------------------------------------ */

function HorizontalPedigree({ pedigree }: { pedigree: Pedigree }) {
    const { ancestors, root, siblings } = pedigree;

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <LegendKey className="bg-primary-tint ring-1 ring-primary/40" label="Subject" />
                <LegendKey className="bg-cat-blue-tint ring-1 ring-cat-blue-fg/30" label="Sire line" />
                <LegendKey className="bg-cat-pink-tint ring-1 ring-cat-pink-fg/30" label="Dam line" />
            </div>

            {/* `min-w-max` on the inner row means it fills the scroll container
                when the tree fits -- so `justify-center` has slack to centre
                into -- and expands past it when the tree is wider, which is
                what keeps horizontal scrolling working. */}
            <div className="w-full overflow-x-auto pb-2">
                <div className="flex min-w-max justify-center">
                    <AncestorBranch node={root} ancestors={ancestors} emphasis />
                </div>
            </div>

            {siblings.length > 0 && (
                <div className="space-y-3 border-t border-border pt-6">
                    <h4 className="group-label text-center">Siblings</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                        {siblings.map((sibling) => (
                            <HorseCard key={sibling.id} node={sibling} muted />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LegendKey({ className, label }: { className: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('size-3 rounded-full', className)} aria-hidden="true" />
            {label}
        </span>
    );
}

/**
 * A horse followed by its ancestry, growing rightward.
 *
 * Recursive rather than a fixed set of generation columns: with columns, the
 * connectors have no anchor to draw between, which is why the lines were
 * missing. Here each pair of parents is a child of the horse it belongs to, so
 * the elbow can be drawn from CSS with no measurement.
 *
 * The two vertical half-segments meet exactly at the parent's centre because
 * the outer flex row is centre-aligned, putting the parent's midpoint on the
 * boundary between its two children.
 */
function AncestorBranch({
    node,
    ancestors,
    role,
    emphasis = false,
}: {
    node: PedigreeNode;
    ancestors?: AncestorPair | null;
    role?: 'sire' | 'dam';
    emphasis?: boolean;
}) {
    const hasAncestors = Boolean(ancestors && (ancestors.sire || ancestors.dam));

    return (
        <div className="flex items-center">
            <HorseCard node={node} role={role} emphasis={emphasis} />

            {hasAncestors && (
                <>
                    {/* Stub from the card out to the vertical bar. */}
                    <span className="h-px w-6 shrink-0 bg-border" aria-hidden="true" />

                    <div className="flex flex-col">
                        <BranchSlot node={ancestors?.sire ?? null} role="sire" position="first" />
                        <BranchSlot node={ancestors?.dam ?? null} role="dam" position="last" />
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * One parent, with the elbow that links it back to its child.
 *
 * `before` is the horizontal arm; `after` is a vertical half-segment -- running
 * down from centre on the top slot and up to centre on the bottom one, so the
 * two together form one continuous line through the child's midpoint. Spacing
 * comes from padding rather than a flex gap, because a gap would break the
 * vertical line into disconnected pieces.
 */
function BranchSlot({ node, role, position }: { node: PedigreeNode | null; role: 'sire' | 'dam'; position: 'first' | 'last' }) {
    return (
        <div
            className={cn(
                'relative py-2 pl-6',
                'before:absolute before:top-1/2 before:left-0 before:h-px before:w-6 before:bg-border before:content-[""]',
                'after:absolute after:left-0 after:w-px after:bg-border after:content-[""]',
                position === 'first' ? 'after:top-1/2 after:bottom-0' : 'after:top-0 after:bottom-1/2',
            )}
        >
            {node ? (
                <AncestorBranch node={node} ancestors={node.ancestors} role={role} />
            ) : (
                <UnknownCard role={role} />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Nodes                                                               */
/* ------------------------------------------------------------------ */

function ParentSlot({ node, role }: { node: PedigreeNode | null; role: 'sire' | 'dam' }) {
    if (!node) {
        return <UnknownCard role={role} />;
    }

    return <HorseCard node={node} role={role} />;
}

function HorseCard({
    node,
    role,
    emphasis = false,
    muted = false,
}: {
    node: PedigreeNode;
    role?: 'sire' | 'dam';
    emphasis?: boolean;
    muted?: boolean;
}) {
    const RoleIcon = role === 'sire' ? Mars : role === 'dam' ? Venus : null;

    const body = (
        <div
            className={cn(
                'flex w-56 shrink-0 items-center gap-3 rounded-popover border p-3 transition-colors',
                'border-border bg-surface shadow-subtle',
                // Tints the sire and dam lines so the legend above means
                // something once the tree is more than one generation deep.
                role === 'sire' && !node.unlinked && 'border-cat-blue-fg/25 bg-cat-blue-tint/40',
                role === 'dam' && !node.unlinked && 'border-cat-pink-fg/25 bg-cat-pink-tint/40',
                emphasis && 'border-primary/40 bg-primary-tint shadow-brand',
                !emphasis && !node.unlinked && 'hover:border-primary/50 hover:shadow-card',
                muted && 'bg-muted/40',
            )}
        >
            <img
                src={node.horse_image ?? PLACEHOLDER_IMAGE}
                alt=""
                className={cn('size-11 shrink-0 rounded-full object-cover', node.unlinked && 'opacity-40 grayscale')}
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    {RoleIcon && <RoleIcon className={cn('size-3.5 shrink-0', role === 'sire' ? 'text-cat-blue-fg' : 'text-cat-pink-fg')} />}
                    <p className="truncate text-sm font-bold text-foreground">{node.horse_name}</p>
                </div>

                <p className="truncate text-xs text-muted-foreground">
                    {node.unlinked
                        ? 'Not recorded on this farm'
                        : [node.kinship, node.breed, node.birth_date ? formatAge(node.birth_date) : null].filter(Boolean).join(' · ') || 'No details'}
                </p>
            </div>
        </div>
    );

    // An ancestor known only by name has no record to open.
    return node.id && !node.unlinked ? (
        <Link href={route('horses.show', node.id)} className="rounded-popover focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-hidden">
            {body}
        </Link>
    ) : (
        body
    );
}

function UnknownCard({ role }: { role: 'sire' | 'dam' }) {
    return (
        <div className="flex w-56 items-center gap-3 rounded-popover border border-dashed border-border bg-muted/30 p-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-subtle-foreground">
                <CircleHelp className="size-5" />
            </span>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-muted-foreground">Unknown {role}</p>
                <p className="text-xs text-subtle-foreground">No record or name</p>
            </div>
        </div>
    );
}

function UnknownParents() {
    return (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted text-subtle-foreground">
                <CircleHelp className="size-5" />
            </span>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No pedigree recorded</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                    Add a sire and dam to this horse to build its family tree. Linking parents that are themselves on this farm unlocks grandparents
                    and siblings.
                </p>
            </div>
        </div>
    );
}
