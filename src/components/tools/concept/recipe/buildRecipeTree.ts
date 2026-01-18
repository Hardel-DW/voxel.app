import type { RecipeProps } from "@voxelio/breeze";
import { RECIPE_BLOCKS } from "@/lib/data/recipeConfig";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import type { TreeNodeType } from "@/lib/utils/tree";

export function buildRecipeTree(elementIds: string[]): TreeNodeType {
    const store = useConfiguratorStore.getState();
    const elements = elementIds.map((id) => store.elements.get(id) as RecipeProps | undefined).filter((el): el is RecipeProps => !!el);

    const root: TreeNodeType = { count: elements.length, children: new Map(), identifiers: [] };

    for (const block of RECIPE_BLOCKS) {
        if (block.isSpecial) continue;
        const matching = elements.filter((el) => block.recipeTypes.includes(el.type));

        const hasSubTypes = block.recipeTypes.length > 1;
        const children = new Map<string, TreeNodeType>();

        if (hasSubTypes) {
            for (const recipeType of block.recipeTypes) {
                const subMatching = matching.filter((el) => el.type === recipeType);
                if (subMatching.length === 0) continue;
                children.set(recipeType, {
                    count: subMatching.length,
                    children: new Map(),
                    identifiers: subMatching.map((el) => el.identifier)
                });
            }
        }

        root.children.set(block.id, {
            count: matching.length,
            children,
            identifiers: hasSubTypes ? [] : matching.map((el) => el.identifier)
        });
    }

    return root;
}
