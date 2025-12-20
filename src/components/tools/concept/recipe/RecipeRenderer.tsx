import type { RecipeProps } from "@voxelio/breeze";
import { lazy, Suspense } from "react";
import { getBlockByRecipeType } from "./recipeConfig";

const CraftingTemplate = lazy(() => import("./template/CraftingTemplate"));
const SmeltingTemplate = lazy(() => import("./template/SmeltingTemplate"));
const StoneCuttingTemplate = lazy(() => import("./template/StoneCuttingTemplate"));
const SmithingTemplate = lazy(() => import("./template/SmithingTemplate"));

const templateMap = {
    "minecraft:crafting_table": CraftingTemplate,
    "minecraft:furnace": SmeltingTemplate,
    "minecraft:blast_furnace": SmeltingTemplate,
    "minecraft:smoker": SmeltingTemplate,
    "minecraft:campfire": SmeltingTemplate,
    "minecraft:stonecutter": StoneCuttingTemplate,
    "minecraft:smithing_table": SmithingTemplate
} as const;

const LoadingTemplate = () => {
    return (
        <div className="flex items-center justify-center h-32">
            <div className="w-10 h-10 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
        </div>
    );
};

export default function RecipeRenderer({ element }: { element: RecipeProps }) {
    const blockConfig = getBlockByRecipeType(element.type);
    if (!blockConfig) return null;

    const Template = templateMap[blockConfig.id as keyof typeof templateMap];
    return Template ? (
        <Suspense fallback={<LoadingTemplate />}>
            <Template slots={element.slots} result={{ item: element.result.id, count: element.result.count }} />
        </Suspense>
    ) : null;
}
