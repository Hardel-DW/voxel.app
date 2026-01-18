import { calculateItemCountRange, Identifier, type LootItem } from "@voxelio/breeze";
import { useLootPoolActions } from "@/components/tools/concept/loot/LootPoolContext";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useTranslate } from "@/lib/i18n";

export default function PoolItemCard({ item, totalWeight }: { item: LootItem; totalWeight: number }) {
    const t = useTranslate();
    const { onEditItem, onDeleteItem, onWeightChange, onNavigate } = useLootPoolActions();
    const isLootTable = item.entryType === "minecraft:loot_table";
    const countRange = calculateItemCountRange(item.functions);
    const weight = item.weight ?? 1;
    const chance = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(1) : "0.0";
    const handleWeightChange = (delta: number) => onWeightChange(item.id, Math.max(1, weight + delta));

    return (
        <div className="relative bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden hover:-translate-y-0.5 transition-transform duration-150 ease-out isolate">
            <div className="absolute inset-0 -z-10 brightness-10">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50">
                <span className="px-2 py-1 text-[10px] font-medium border border-zinc-600/80 text-zinc-300 rounded-md uppercase">
                    {item.entryType && Identifier.toDisplay(item.entryType)}
                </span>
                <div className="flex items-center gap-1">
                    {isLootTable && (
                        <button
                            type="button"
                            onClick={() => onNavigate(item.name)}
                            className="text-[10px] font-medium text-zinc-300 uppercase border border-zinc-800 rounded-md px-2 py-1 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            {t("loot:card.go_to")}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onEditItem(item.id)}
                        className="p-1.5 bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded transition-colors cursor-pointer">
                        <img src="/icons/tools/overview/edit.svg" alt="Edit" className="w-4 h-4 invert opacity-70" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded transition-colors cursor-pointer">
                        <img src="/icons/tools/overview/delete.svg" alt="Delete" className="w-4 h-4 invert opacity-70" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
                {item.entryType === "minecraft:loot_table" ? (
                    <div className="size-10 shrink-0 flex items-center justify-center">
                        <img src="/images/features/title/cycle_white.webp" alt="Loot Table" className="size-8" />
                    </div>
                ) : item.entryType === "minecraft:empty" ? (
                    <div className="size-10 shrink-0 bg-zinc-800/50 rounded flex items-center justify-center">
                        <span className="text-zinc-500 text-lg">∅</span>
                    </div>
                ) : (
                    <TextureRenderer id={item.name} className="size-10 shrink-0" />
                )}
                <div className="flex flex-col w-full">
                    <span className="text-white text-sm font-medium truncate">{Identifier.toDisplay(item.name)}</span>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-zinc-500 text-xs font-medium truncate">{item.name}</span>
                        {countRange.max > 1 && (
                            <span className="text-xs text-zinc-500 shrink-0">
                                ×{countRange.min === countRange.max ? countRange.min : `${countRange.min}-${countRange.max}`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between px-4 py-3 border-t border-zinc-800/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{t("loot:card.chance_label")}</span>
                    <span className="text-xl font-bold text-white">
                        {chance}
                        <span className="text-sm text-zinc-400">%</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase">{t("loot:card.weight_label")}</span>
                    <div className="flex items-center bg-zinc-900/40 border border-zinc-800/40 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => handleWeightChange(-1)}
                            className="px-2.5 py-1 hover:bg-zinc-800/50 transition-colors text-zinc-400">
                            -
                        </button>
                        <input
                            type="text"
                            className="px-2 py-1 text-white font-medium w-16 text-center bg-transparent border-none focus:outline-none appearance-none"
                            value={weight}
                            onChange={(e) => onWeightChange(item.id, Number(e.target.value))}
                        />
                        <button
                            type="button"
                            onClick={() => handleWeightChange(1)}
                            className="px-2.5 py-1 hover:bg-zinc-800/50 transition-colors text-zinc-400">
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
