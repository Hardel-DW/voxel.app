import { CoreAction, isVoxel, RecipeAction, type RecipeProps } from "@voxelio/breeze";
import { useState } from "react";
import RecipeRenderer from "@/components/tools/concept/recipe/RecipeRenderer";
import RecipeSelector from "@/components/tools/concept/recipe/RecipeSelector";
import { getBlockByRecipeType, getFirstTypeFromSelection, RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import { getCurrentElement, useConfiguratorStore } from "@/components/tools/Store";
import { Tabs, TabsTrigger } from "@/components/ui/Tabs";

const TAB_CONFIGS = {
    "minecraft:crafting_table": [
        { label: "Shaped", value: "minecraft:crafting_shaped" },
        { label: "Shapeless", value: "minecraft:crafting_shapeless" },
        { label: "Transmute", value: "minecraft:crafting_transmute" }
    ],
    "minecraft:smithing_table": [
        { label: "Transform", value: "minecraft:smithing_transform" },
        { label: "Trim", value: "minecraft:smithing_trim" }
    ]
};
export default function RecipeSection() {
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentBlock = currentElement && isVoxel(currentElement, "recipe") ? getBlockByRecipeType(currentElement.type) : undefined;
    const [selection, setSelection] = useState<string>(currentBlock?.id ?? RECIPE_BLOCKS[0].id);
    if (!currentElement || !isVoxel(currentElement, "recipe")) return null;

    const handleSelectionChange = (newSelection: string) => {
        const newRecipeType = getFirstTypeFromSelection(newSelection);
        handleChange(RecipeAction.convertRecipeType(newRecipeType));
        setSelection(newSelection);
    };

    return (
        <div className="relative overflow-hidden bg-black/35 border-t-2 border-l-2 border-stone-900 ring-0 ring-zinc-900 transition-all hover:ring-1 rounded-xl p-6">
            <div className="px-6 flex justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Recipe</h2>
                    <p className="text-sm text-zinc-400">Configure your recipe</p>
                </div>
                <div className="relative">
                    <RecipeSelector
                        value={selection}
                        onChange={handleSelectionChange}
                        recipeCounts={new Map<string, number>(RECIPE_BLOCKS.map((block) => [block.id, 0]))}
                        selectMode={true}
                    />
                </div>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pb-6 pt-2">
                <RecipeRenderer element={currentElement} />
                <div className="overflow-hidden mt-4 border rounded-lg border-zinc-900 p-4 flex flex-col gap-8 relative">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-base font-semibold text-zinc-400">Result count</p>
                            <p className="text-xs text-zinc-500">The number of items which will be produced by the recipe</p>
                        </div>
                        <ToolCounter
                            min={1}
                            max={64}
                            step={1}
                            action={(value: number) => CoreAction.setValue("result.count", value)}
                            renderer={(el: RecipeProps) => el.result.count}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-base font-semibold text-zinc-400">Recipe type</p>
                            <p className="text-xs text-zinc-500 pr-4">The type of recipe which will be used to craft the item</p>
                        </div>
                        {currentBlock && TAB_CONFIGS[currentBlock.id as keyof typeof TAB_CONFIGS] && (
                            <Tabs
                                defaultValue={currentElement.type}
                                onValueChange={(newType: string) => handleChange(RecipeAction.convertRecipeType(newType))}>
                                {TAB_CONFIGS[currentBlock.id as keyof typeof TAB_CONFIGS].map((tab) => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </Tabs>
                        )}
                    </div>

                    <div className="absolute inset-0 -z-10 brightness-25">
                        <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>
        </div>
    );
}
