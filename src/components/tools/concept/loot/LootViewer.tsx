import type { FlattenedLootItem, LootTableProps } from "@voxelio/breeze";
import RewardItem from "@/components/tools/concept/loot/RewardItem";
import { type BaseInteractiveComponent, useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";

export type LootViewerProps = BaseInteractiveComponent & {
    title: string;
    lootTable: LootTableProps;
    data: FlattenedLootItem[];
};

export default function LootViewer(props: LootViewerProps) {
    const t = useTranslate();
    const { handleChange } = useInteractiveLogic<LootViewerProps, boolean>({ component: props });
    const totalProbability = props.data.reduce((sum, reward) => sum + reward.probability, 0);

    return (
        <div className="relative overflow-hidden bg-black/35 border-t-2 border-l-2 border-zinc-900 ring-0 ring-zinc-900 rounded-xl w-full min-h-full">
            <div className="overflow-y-auto col-span-5 flex flex-col gap-y-4 p-8">
                <div>
                    <div className="flex justify-between items-center gap-y-2">
                        <h1 className="text-2xl font-bold text-white">{t("loot:main.title")}</h1>
                        <p className="text-sm text-zinc-400">
                            {t("loot:main.probability_mass")}: {totalProbability.toFixed(2)}
                        </p>
                    </div>
                    <div className="w-full h-1 bg-zinc-700 rounded-full" />
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {props.data.map((reward, index) => (
                        <RewardItem
                            key={`${reward.name}-${reward.id ?? index}`}
                            {...reward}
                            normalizedProbability={totalProbability > 0 ? reward.probability / totalProbability : undefined}
                            onDelete={reward.id ? (id: string) => handleChange(id) : undefined}
                        />
                    ))}
                </ul>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
            <div className="absolute inset-0 -z-10 brightness-30 rotate-180">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
        </div>
    );
}
