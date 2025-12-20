import {
    analyserCollection,
    type DataDrivenRegistryElement,
    type FlattenedLootItem,
    Identifier,
    isVoxel,
    LootTableFlattener,
    type LootTableProps,
    type MinecraftLootTable,
    type TagType
} from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { useConfiguratorStore } from "@/components/tools/Store";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { mergeRegistries } from "@/lib/registry";

function computeAllFlattened(
    lootTables: LootTableProps[],
    vanillaLootTables: FetchedRegistry<MinecraftLootTable> | undefined,
    mergedTags: DataDrivenRegistryElement<TagType>[]
): Map<string, FlattenedLootItem[]> {
    const tableMap = new Map<string, LootTableProps>();

    if (vanillaLootTables) {
        for (const [key, data] of Object.entries(vanillaLootTables)) {
            const parsed = analyserCollection.loot_table.parser({
                element: { identifier: Identifier.of(key, "loot_table"), data } as DataDrivenRegistryElement<MinecraftLootTable>
            });
            tableMap.set(new Identifier(parsed.identifier).toString(), parsed);
        }
    }

    for (const table of lootTables) {
        tableMap.set(new Identifier(table.identifier).toString(), table);
    }

    const allTables = Array.from(tableMap.values());
    const flattener = new LootTableFlattener(allTables, mergedTags);
    const result = new Map<string, FlattenedLootItem[]>();

    for (const table of allTables) {
        const key = new Identifier(table.identifier).toString();
        result.set(key, flattener.flatten(table.identifier));
    }

    return result;
}

export function useFlattenedLootCache(): { itemsMap: Map<string, FlattenedLootItem[]>; isLoading: boolean } {
    const lootTables = useConfiguratorStore(
        useShallow((state) => Array.from(state.elements.values()).filter((el): el is LootTableProps => isVoxel(el, "loot_table")))
    );
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const { data: vanillaTags, isLoading: tagsLoading } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/item");
    const { data: vanillaLootTables, isLoading: lootLoading } = useRegistry<FetchedRegistry<MinecraftLootTable>>("summary", "loot_table");

    const isLoading = tagsLoading || lootLoading;
    if (isLoading) {
        return { itemsMap: new Map(), isLoading: true };
    }

    const mergedTags = vanillaTags ? mergeRegistries(vanillaTags, datapackTags, "tags/item") : datapackTags;
    const itemsMap = computeAllFlattened(lootTables, vanillaLootTables, mergedTags);
    return { itemsMap, isLoading: false };
}

export function useFlattenedLootItems(table: LootTableProps | undefined): { items: FlattenedLootItem[]; isLoading: boolean } {
    const { itemsMap, isLoading } = useFlattenedLootCache();
    if (!table) return { items: [], isLoading };

    const key = new Identifier(table.identifier).toString();
    return { items: itemsMap.get(key) ?? [], isLoading };
}
