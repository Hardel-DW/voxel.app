import { CoreAction, isVoxel, RecipeAction, type RecipeProps } from "@voxelio/breeze";
import { useState } from "react";
import RecipeRenderer from "@/components/tools/concept/recipe/RecipeRenderer";
import RecipeSelector from "@/components/tools/concept/recipe/RecipeSelector";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import { Tabs, TabsTrigger } from "@/components/ui/Tabs";
import { getAllRecipeTypes, getBlockByRecipeType, getBlockConfig, RECIPE_BLOCKS } from "@/lib/data/recipeConfig";
import { useTranslate } from "@/lib/i18n";
import { getCurrentElement, useConfiguratorStore } from "@/lib/store/StudioStore";

const TAB_CONFIGS = {
    "minecraft:crafting_table": [
        { labelKey: "recipe:tab.shaped", value: "minecraft:crafting_shaped" },
        { labelKey: "recipe:tab.shapeless", value: "minecraft:crafting_shapeless" },
        { labelKey: "recipe:tab.transmute", value: "minecraft:crafting_transmute" }
    ],
    "minecraft:smithing_table": [
        { labelKey: "recipe:tab.transform", value: "minecraft:smithing_transform" },
        { labelKey: "recipe:tab.trim", value: "minecraft:smithing_trim" }
    ]
};
export default function RecipeSection() {
    const t = useTranslate();
    const currentElement = useConfiguratorStore((state) => getCurrentElement(state));
    const handleChange = useConfiguratorStore((state) => state.handleChange);
    const currentBlock = currentElement && isVoxel(currentElement, "recipe") ? getBlockByRecipeType(currentElement.type) : undefined;
    const [selection, setSelection] = useState<string>(currentBlock?.id ?? RECIPE_BLOCKS[0].id);
    if (!currentElement || !isVoxel(currentElement, "recipe")) return null;

    const handleSelectionChange = (newSelection: string) => {
        const newRecipeType =
            selection === "minecraft:barrier" ? getAllRecipeTypes()[0] : getBlockConfig(selection)?.recipeTypes[0] || selection;
        handleChange(RecipeAction.convertRecipeType(newRecipeType));
        setSelection(newSelection);
    };

    return (
        <div className="relative overflow-hidden bg-black/35 border-t-2 border-l-2 border-zinc-900 ring-0 ring-zinc-900 transition-all hover:ring-1 rounded-xl p-6">
            <div className="px-6 flex justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">{t("recipe:section.title")}</h2>
                    <p className="text-sm text-zinc-400">{t("recipe:section.description")}</p>
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
                            <p className="text-base font-semibold text-zinc-400">{t("recipe:section.result_count")}</p>
                            <p className="text-xs text-zinc-500">{t("recipe:section.result_count_description")}</p>
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
                            <p className="text-base font-semibold text-zinc-400">{t("recipe:section.recipe_type")}</p>
                            <p className="text-xs text-zinc-500 pr-4">{t("recipe:section.recipe_type_description")}</p>
                        </div>
                        {currentBlock && TAB_CONFIGS[currentBlock.id as keyof typeof TAB_CONFIGS] && (
                            <Tabs
                                defaultValue={currentElement.type}
                                onValueChange={(newType: string) => handleChange(RecipeAction.convertRecipeType(newType))}>
                                {TAB_CONFIGS[currentBlock.id as keyof typeof TAB_CONFIGS].map((tab) => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        {t(tab.labelKey)}
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
