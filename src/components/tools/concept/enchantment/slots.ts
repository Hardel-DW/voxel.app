import { t } from "@/lib/i18n";

export const SLOT_CONFIGS = [
    {
        id: "mainhand",
        name: t("enchantment.slots.mainhand.title"),
        image: "/images/features/slots/mainhand.webp",
        slots: ["mainhand", "any", "hand"]
    },
    {
        id: "offhand",
        name: t("enchantment.slots.offhand.title"),
        image: "/images/features/slots/offhand.webp",
        slots: ["offhand", "any", "hand"]
    },
    { id: "body", name: t("enchantment.slots.body.title"), image: "/images/features/slots/body.webp", slots: ["body", "any"] },
    { id: "saddle", name: t("enchantment.slots.saddle.title"), image: "/images/features/slots/saddle.webp", slots: ["saddle", "any"] },
    { id: "head", name: t("enchantment.slots.head.title"), image: "/images/features/slots/head.webp", slots: ["head", "any", "armor"] },
    { id: "chest", name: t("enchantment.slots.chest.title"), image: "/images/features/slots/chest.webp", slots: ["chest", "any", "armor"] },
    { id: "legs", name: t("enchantment.slots.legs.title"), image: "/images/features/slots/legs.webp", slots: ["legs", "any", "armor"] },
    { id: "feet", name: t("enchantment.slots.feet.title"), image: "/images/features/slots/feet.webp", slots: ["feet", "any", "armor"] }
];
