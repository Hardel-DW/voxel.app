import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Identifier, isVoxel, LootTableAction } from "@voxelio/breeze";
import LootItemEditor from "@/components/tools/concept/loot/LootItemEditor";
import { LootPoolContext } from "@/components/tools/concept/loot/LootPoolContext";
import PoolSection from "@/components/tools/concept/loot/PoolSection";
import ItemSelector from "@/components/tools/elements/gui/ItemSelector";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarNavigation } from "@/components/tools/floatingbar/ToolbarNavigation";
import { ToolGrab } from "@/components/tools/floatingbar/ToolGrab";
import { Button } from "@/components/ui/Button";
import useRegistry from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { getCurrentElement, useConfiguratorStore } from "@/lib/store/StudioStore";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/pools")({
    component: PoolsPage
});

function PoolsPage() {
    const t = useTranslate();
    const { lang } = Route.useParams();
    const navigate = useNavigate();
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentElementId = useNavigationStore((state) => state.currentElementId);
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    const goto = useNavigationStore((state) => state.goto);
    const { expand, collapse } = useDynamicIsland();
    const { data } = useRegistry<string[]>("registry", "item");
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const lootTables = getRegistry("loot_table");
    if (!lootTable) return null;

    const poolCount = Math.max(
        ...lootTable.items.map((i) => i.poolIndex + 1),
        ...lootTable.groups.map((g) => g.poolIndex + 1),
        lootTable.pools?.length ?? 0,
        1
    );
    const itemsByPool = Map.groupBy(lootTable.items, (item) => item.poolIndex);
    const items = data?.filter((i) => i !== "air").map((i) => Identifier.of(i, "item").toString());

    const onAddItem = (poolIndex: number) => {
        expand(
            <ItemSelector
                currentItem=""
                onItemSelect={(itemName) => {
                    if (!currentElementId) return;
                    const action = LootTableAction.addLootItem(poolIndex, { name: itemName, weight: 1 });
                    handleChange(action, currentElementId, itemName);
                    collapse();
                }}
                items={items}
            />
        );
    };

    const onEditItem = (id: string) => {
        const item = lootTable.items.find((i) => i.id === id);
        if (item) expand(<LootItemEditor item={item} />, "fit");
    };

    const onDeleteItem = (id: string) => {
        if (!currentElementId) return;
        const action = LootTableAction.removeLootItem(id);
        handleChange(action, currentElementId, id);
    };

    const onWeightChange = (id: string, weight: number) => {
        if (!currentElementId) return;
        const action = LootTableAction.modifyLootItem(id, "weight", weight);
        handleChange(action, currentElementId, weight);
    };

    const onBalanceWeights = (poolIndex: number) => {
        if (!currentElementId) return;
        const action = LootTableAction.balanceWeights(poolIndex);
        handleChange(action, currentElementId, poolIndex);
    };

    const handleAddPool = () => {
        if (!currentElementId) return;
        const newPoolIndex = poolCount;
        const action = LootTableAction.addLootItem(newPoolIndex, { name: "minecraft:stone", weight: 1 });
        handleChange(action, currentElementId, newPoolIndex);
    };

    const onNavigate = (name: string) => {
        const targetId = Identifier.of(name, "loot_table");
        const target = lootTables.find((lt) => new Identifier(lt.identifier).equals(targetId));
        if (!target) return;
        goto(new Identifier(target.identifier).toUniqueKey());
        navigate({ to: "/$lang/studio/editor/loot_table/pools", params: { lang } });
    };

    return (
        <LootPoolContext value={{ onAddItem, onEditItem, onDeleteItem, onWeightChange, onBalanceWeights, onNavigate }}>
            <div className="h-full overflow-y-auto flex flex-col">
                <Toolbar>
                    <ToolGrab />
                    <ToolbarNavigation />
                </Toolbar>

                <div className="absolute inset-0 -z-10 brightness-30">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>

                <div className="sticky top-0 z-30 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">{t("loot:pools.title")}</h1>
                    <Button variant="default" onClick={handleAddPool}>
                        {t("loot:pools.add_pool")}
                    </Button>
                </div>

                <div className="flex flex-col gap-6 p-8">
                    {Array.from({ length: poolCount }, (_, poolIndex) => {
                        const poolItems = itemsByPool.get(poolIndex) ?? [];
                        const poolData = lootTable.pools?.find((p) => p.poolIndex === poolIndex);
                        return <PoolSection key={poolIndex.toString()} poolIndex={poolIndex} poolData={poolData} items={poolItems} />;
                    })}
                </div>
            </div>
        </LootPoolContext>
    );
}
