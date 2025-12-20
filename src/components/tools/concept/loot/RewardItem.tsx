import { calculateItemCountRange, type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { cn } from "@/lib/utils";

interface RewardItemProps extends FlattenedLootItem {
    normalizedProbability?: number;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onNavigate?: (lootTable: string) => void;
}

export default function RewardItem(props: RewardItemProps) {
    const countRange = calculateItemCountRange(props.functions);
    const probabilityPercentage = props.normalizedProbability ? (props.normalizedProbability * 100).toFixed(1) : null;
    const handleDelete = () => props.id && props.onDelete?.(props.id);
    const handleEdit = () => props.id && props.onEdit?.(props.id);
    const isNested = props.path.length > 1;
    const sourceTable = isNested ? props.path[props.path.length - 1] : null;
    const sourcePath = sourceTable ? Identifier.of(sourceTable, "loot_table") : null;

    const handleNavigate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (sourceTable && props.onNavigate) props.onNavigate(sourceTable);
    };

    return (
        <li
            onClick={isNested ? undefined : handleEdit}
            className={cn(
                "group/reward relative overflow-hidden text-zinc-400 tracking-tighter text-xs bg-zinc-900/20 rounded-md border p-2 pl-4 h-fit flex flex-col gap-2 transition-colors",
                isNested ? "border-dashed border-zinc-700/50" : "border-zinc-900 cursor-pointer hover:border-zinc-700"
            )}>
            {isNested && (
                <div className="flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={handleNavigate}
                        className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                        <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="opacity-60">From:</span>
                        <span className="font-medium">{sourcePath?.toString()}</span>
                    </button>
                    <span className="text-[10px] text-zinc-600 font-medium">Not Editable</span>
                </div>
            )}

            <div className="flex items-center justify-between gap-x-8">
                <div className="flex items-center gap-x-4">
                    <TextureRenderer id={props.name} className="size-10" />
                    <div className="flex flex-col">
                        <h2 className="text-base font-extralight text-zinc-200 font-seven -tracking-wide">
                            {Identifier.toDisplay(props.name)}
                        </h2>
                        <p className="text-xs text-zinc-500">{props.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-x-4">
                    {!isNested && (
                        <button onClick={handleDelete} type="button" className="p-1.5 cursor-pointer hidden group-hover/reward:block">
                            <svg
                                className="size-4 hover:text-red-500 transition-colors"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" />
                            </svg>
                        </button>
                    )}
                    <div className="flex items-center gap-x-4 text-right bg-zinc-900/70 rounded-md px-4 py-1">
                        <div className="text-right">
                            <p className="text-white font-bold text-lg">
                                {countRange.min === countRange.max ? `×${countRange.min}` : `×${countRange.min}-${countRange.max}`}
                            </p>
                            {probabilityPercentage && <p className="text-xs text-zinc-400">{probabilityPercentage}% chance</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30 hue-rotate-15">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
        </li>
    );
}
