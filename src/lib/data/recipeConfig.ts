export interface RecipeBlockConfig {
    id: string;
    name: string;
    recipeTypes: string[];
    isSpecial?: boolean; // For barrier (all) and crafting_table (crafting_*)
}

export const RECIPE_BLOCKS: RecipeBlockConfig[] = [
    {
        id: "minecraft:barrier",
        name: "recipe:block.all",
        recipeTypes: [],
        isSpecial: true
    },
    {
        id: "minecraft:campfire",
        name: "recipe:block.campfire",
        recipeTypes: ["minecraft:campfire_cooking"]
    },
    {
        id: "minecraft:furnace",
        name: "recipe:block.furnace",
        recipeTypes: ["minecraft:smelting"]
    },
    {
        id: "minecraft:blast_furnace",
        name: "recipe:block.blast_furnace",
        recipeTypes: ["minecraft:blasting"]
    },
    {
        id: "minecraft:smoker",
        name: "recipe:block.smoker",
        recipeTypes: ["minecraft:smoking"]
    },
    {
        id: "minecraft:stonecutter",
        name: "recipe:block.stonecutter",
        recipeTypes: ["minecraft:stonecutting"]
    },
    {
        id: "minecraft:crafting_table",
        name: "recipe:block.crafting_table",
        recipeTypes: [
            "minecraft:crafting_shapeless",
            "minecraft:crafting_shaped",
            "minecraft:crafting_decorated_pot",
            "minecraft:crafting_special_armordye",
            "minecraft:crafting_special_bannerduplicate",
            "minecraft:crafting_special_bookcloning",
            "minecraft:crafting_special_firework_rocket",
            "minecraft:crafting_special_firework_star",
            "minecraft:crafting_special_firework_star_fade",
            "minecraft:crafting_special_mapcloning",
            "minecraft:crafting_special_mapextending",
            "minecraft:crafting_special_repairitem",
            "minecraft:crafting_special_shielddecoration",
            "minecraft:crafting_special_tippedarrow",
            "minecraft:crafting_transmute"
        ]
    },
    {
        id: "minecraft:smithing_table",
        name: "recipe:block.smithing_table",
        recipeTypes: ["minecraft:smithing_transform", "minecraft:smithing_trim"]
    }
];

export const canBlockHandleRecipeType = (id: string, type: string) =>
    id === "minecraft:barrier" ? true : (getBlockConfig(id)?.recipeTypes.some((e) => type.includes(e)) ?? false);
export const getBlockConfig = (id: string) => RECIPE_BLOCKS.find((block) => block.id === id);
export const getBlockByRecipeType = (type: string) => RECIPE_BLOCKS.find((block) => block.recipeTypes.includes(type)) ?? RECIPE_BLOCKS[0];
export const getAllBlockIds = (inc: boolean = true) => RECIPE_BLOCKS.filter((block) => inc || !block.isSpecial).map((block) => block.id);
export const getAllRecipeTypes = () => RECIPE_BLOCKS.filter((block) => !block.isSpecial).flatMap((block) => block.recipeTypes);
export const isBlockId = (id: string) => RECIPE_BLOCKS.some((block) => block.id === id);
