export type CONCEPT_KEY = "enchantment" | "loot_table" | "recipe" | "structure";

export type Concept = {
    registry: CONCEPT_KEY;
    title: string;
    image: { src: string; alt: string };
    overview: string;
    tabs: Tab[];
};

export type Tab = {
    id: string;
    text: string;
    url: string;
    soon?: boolean;
};

export const CONCEPTS: Concept[] = [
    {
        registry: "enchantment",
        title: "Enchantment",
        image: {
            src: "/images/features/item/enchanted_book.webp",
            alt: "Enchantment"
        },
        overview: "/editor/enchantment/overview",
        tabs: [
            {
                id: "global",
                text: "enchantment:section.global",
                url: "/editor/enchantment/main"
            },
            {
                id: "find",
                text: "enchantment:section.find",
                url: "/editor/enchantment/find"
            },
            {
                id: "slots",
                text: "enchantment:section.slots",
                url: "/editor/enchantment/slots"
            },
            {
                id: "items",
                text: "enchantment:section.supported",
                url: "/editor/enchantment/items"
            },
            {
                id: "exclusive",
                text: "enchantment:section.exclusive",
                url: "/editor/enchantment/exclusive"
            },
            {
                id: "technical",
                text: "enchantment:section.technical",
                url: "/editor/enchantment/technical"
            }
        ]
    },
    {
        registry: "loot_table",
        title: "Loot Table",
        image: {
            src: "/images/features/item/bundle_close.webp",
            alt: "Loot Table"
        },
        overview: "/editor/loot_table/overview",
        tabs: [
            {
                id: "main",
                text: "loot:section.main",
                url: "/editor/loot_table/main"
            },
            {
                id: "pools",
                text: "loot:section.pools",
                url: "/editor/loot_table/pools"
            }
        ]
    },
    {
        registry: "recipe",
        title: "Recipe",
        image: {
            src: "/images/features/block/crafting_table.webp",
            alt: "Recipe"
        },
        overview: "/editor/recipe/overview",
        tabs: [
            {
                id: "main",
                text: "recipe:section.main",
                url: "/editor/recipe/main"
            }
        ]
    },
    {
        registry: "structure",
        title: "Structure",
        image: {
            src: "/images/features/block/jigsaw.webp",
            alt: "Structure"
        },
        overview: "/editor/structure/overview",
        tabs: []
    }
];
