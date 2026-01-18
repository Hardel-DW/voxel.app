import type { LootItem, PoolData } from "@voxelio/breeze";
import { useLootPoolActions } from "@/components/tools/concept/loot/LootPoolContext";
import PoolItemCard from "@/components/tools/concept/loot/PoolItemCard";
import { Button } from "@/components/ui/Button";
import { useTranslate } from "@/lib/i18n";

export default function PoolSection({ poolIndex, poolData, items }: { poolIndex: number; poolData?: PoolData; items: LootItem[] }) {
    const t = useTranslate();
    const { onAddItem, onBalanceWeights } = useLootPoolActions();
    const rollsDisplay = poolData ? formatRolls(poolData.rolls) : "1";
    const bonusRollsDisplay = poolData?.bonus_rolls ? formatRolls(poolData.bonus_rolls) : "0";
    const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1), 0);

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-6">
                    <h3 className="text-lg font-semibold text-white">{t("loot:pools.pool_title", { index: poolIndex + 1 })}</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg">
                            <span className="text-xs text-zinc-500 uppercase">{t("loot:pools.rolls")}</span>
                            <span className="text-sm text-white font-medium">{rollsDisplay}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg">
                            <span className="text-xs text-zinc-500 uppercase">{t("loot:pools.bonus_rolls")}</span>
                            <span className="text-sm text-white font-medium">{bonusRollsDisplay}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost_border" size="sm" onClick={() => onBalanceWeights(poolIndex)}>
                        {t("loot:pools.balance")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onAddItem(poolIndex)}>
                        {t("loot:pools.add_item")}
                    </Button>
                </div>
            </div>

            <div className="p-6">
                {items.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-8">{t("loot:pools.empty")}</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {items.map((item) => (
                            <PoolItemCard key={item.id} item={item} totalWeight={totalWeight} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function formatRolls(rolls: unknown): string {
    if (typeof rolls === "number") return String(rolls);
    if (typeof rolls === "object" && rolls !== null) {
        const r = rolls as { min?: number; max?: number; type?: string; value?: number };
        if (r.type === "minecraft:uniform" && r.min !== undefined && r.max !== undefined) {
            return `${r.min}-${r.max}`;
        }
        if (r.type === "minecraft:constant" && r.value !== undefined) {
            return String(r.value);
        }
    }
    return "1";
}
