import { calculateItemCountRange, Identifier, type LootItem, LootTableAction } from "@voxelio/breeze";
import { useState } from "react";
import ItemSelector from "@/components/tools/elements/gui/ItemSelector";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import Counter from "@/components/ui/Counter";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import useRegistry from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { cn } from "@/lib/utils";

interface LootItemEditorProps {
    item: LootItem;
}

export default function LootItemEditor({ item }: LootItemEditorProps) {
    const t = useTranslate();
    const countRange = calculateItemCountRange(item.functions);
    const [name, setName] = useState(item.name);
    const [weight, setWeight] = useState(item.weight ?? 1);
    const [countMin, setCountMin] = useState(countRange.min);
    const [countMax, setCountMax] = useState(countRange.max);
    const [selectingItem, setSelectingItem] = useState(false);
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useNavigationStore((state) => state.currentElementId);
    const { data } = useRegistry<string[]>("registry", "item");
    const items = data?.filter((i) => i !== "air").map((i) => Identifier.of(i, "item").toString());
    const { collapse, resize } = useDynamicIsland();
    const ref = useClickOutside(() => !selectingItem && collapse());

    const handleNameChange = (newName: string) => {
        setName(newName);
        setSelectingItem(false);
        resize("fit");
        if (!currentElementId) return;
        handleChange(LootTableAction.modifyLootItem(item.id, "name", newName), currentElementId, newName);
    };

    const openItemSelector = () => {
        resize("large");
        setSelectingItem(true);
    };

    const handleWeightChange = (newWeight: number) => {
        setWeight(newWeight);
        if (!currentElementId) return;
        handleChange(LootTableAction.modifyLootItem(item.id, "weight", newWeight), currentElementId, newWeight);
    };

    const handleCountMinChange = (min: number) => {
        const validMax = Math.max(min, countMax);
        setCountMin(min);
        setCountMax(validMax);
        if (!currentElementId) return;
        handleChange(LootTableAction.setItemCount(item.id, { min, max: validMax }), currentElementId, { min, max: validMax });
    };

    const handleCountMaxChange = (max: number) => {
        const validMax = Math.max(countMin, max);
        setCountMax(validMax);
        if (!currentElementId) return;
        handleChange(LootTableAction.setItemCount(item.id, { min: countMin, max: validMax }), currentElementId, {
            min: countMin,
            max: validMax
        });
    };

    const handleDelete = () => {
        if (!currentElementId) return;
        handleChange(LootTableAction.removeLootItem(item.id), currentElementId, item.id);
        collapse();
    };

    if (selectingItem) {
        return <ItemSelector currentItem={name} onItemSelect={handleNameChange} items={items} />;
    }

    const identifier = Identifier.of(name, "item");

    return (
        <div ref={ref} className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                        <img src="/icons/pencil.svg" alt="Pencil" className="size-4 invert opacity-60" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-100">{t("loot:editor.title")}</h3>
                        <p className="text-xs text-zinc-500">{identifier.toResourceName()}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="size-9 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 py-4">
                <div className="flex gap-6">
                    <button
                        type="button"
                        onClick={openItemSelector}
                        className={cn(
                            "group relative size-28 flex flex-col items-center justify-center gap-1",
                            "bg-linear-to-b from-zinc-800/30 to-zinc-900/50",
                            "border border-zinc-800 rounded-xl",
                            "hover:border-zinc-600 hover:from-zinc-700/30 hover:to-zinc-800/50",
                            "transition-all cursor-pointer shrink-0"
                        )}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <TextureRenderer id={name} size={48} className="size-12 relative" />
                        </div>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">
                            {t("loot:editor.change_item")}
                        </span>
                    </button>

                    <div className="flex flex-col gap-5 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-200">{t("loot:editor.weight_label")}</span>
                                <span className="text-xs text-zinc-500">{t("loot:editor.weight_description")}</span>
                            </div>
                            <Counter value={weight} min={1} max={999} step={1} onChange={handleWeightChange} />
                        </div>

                        <div className="h-px bg-zinc-800/50" />

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-200">{t("loot:editor.count_label")}</span>
                                <span className="text-xs text-zinc-500">{t("loot:editor.count_description")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Counter value={countMin} min={1} max={64} step={1} onChange={handleCountMinChange} />
                                <span className="text-zinc-600 text-sm">—</span>
                                <Counter value={countMax} min={1} max={64} step={1} onChange={handleCountMaxChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-400">{t("loot:editor.footer_text")}</span>
                <button
                    type="button"
                    onClick={collapse}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer">
                    {t("loot:editor.close")}
                </button>
            </div>
        </div>
    );
}
