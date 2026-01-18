import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Identifier, isVoxel, LootTableAction } from "@voxelio/breeze";
import { useState } from "react";
import LootItemEditor from "@/components/tools/concept/loot/LootItemEditor";
import RewardItem from "@/components/tools/concept/loot/RewardItem";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarNavigation } from "@/components/tools/floatingbar/ToolbarNavigation";
import { ToolbarSearch } from "@/components/tools/floatingbar/ToolbarSearch";
import { ToolGrab } from "@/components/tools/floatingbar/ToolGrab";
import { useFlattenedLootItems } from "@/lib/hook/useFlattenedLootItems";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { getCurrentElement, useConfiguratorStore } from "@/lib/store/StudioStore";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/main")({
    component: LootMainPage
});

function LootMainPage() {
    const t = useTranslate();
    const [searchValue, setSearchValue] = useState("");
    const { lang } = Route.useParams();
    const navigate = useNavigate();
    const { expand } = useDynamicIsland();
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useNavigationStore((state) => state.currentElementId);
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    const goto = useNavigationStore((state) => state.goto);
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const lootTables = getRegistry("loot_table");
    const { items, isLoading } = useFlattenedLootItems(lootTable);
    if (!lootTable) return null;

    const totalProbability = items.reduce((sum, reward) => sum + reward.probability, 0);
    const filteredItems = items.filter((item) => !searchValue || item.name.toLowerCase().includes(searchValue.toLowerCase()));

    const handleDelete = (id: string) => {
        if (!currentElementId) return;
        const action = LootTableAction.removeLootItem(id);
        handleChange(action, currentElementId, id);
    };

    const handleEdit = (id: string) => {
        const item = lootTable.items.find((i) => i.id === id);
        if (item) expand(<LootItemEditor item={item} />, "fit");
    };

    const handleNavigate = (name: string) => {
        const targetId = Identifier.of(name, "loot_table");
        const target = lootTables.find((lt) => new Identifier(lt.identifier).equals(targetId));
        if (!target) return;
        goto(new Identifier(target.identifier).toUniqueKey());
        navigate({ to: "/$lang/studio/editor/loot_table/main", params: { lang } });
    };

    if (isLoading || items.length === 0) {
        return <div className="p-8 text-sm text-zinc-400">{t(isLoading ? "loot:main.loading" : "loot:main.empty")}</div>;
    }

    return (
        <div className="h-full overflow-y-auto flex flex-col">
            <Toolbar>
                <ToolGrab />
                <ToolbarNavigation />
                <ToolbarSearch placeholder="Search items..." value={searchValue} onChange={setSearchValue} />
            </Toolbar>

            <div className="col-span-5 flex flex-col gap-y-4 p-8">
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
                    {filteredItems.map((reward, index) => (
                        <RewardItem
                            key={`${reward.name}-${reward.id ?? index}`}
                            {...reward}
                            normalizedProbability={totalProbability > 0 ? reward.probability / totalProbability : undefined}
                            onDelete={reward.id ? handleDelete : undefined}
                            onEdit={reward.id ? handleEdit : undefined}
                            onNavigate={handleNavigate}
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
