import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolInline from "@/components/tools/elements/ToolInline";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { useTranslate } from "@/lib/i18n";

const alfheim = {
    random_chest: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/alfheim_tree/random_loot"
    },
    vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/vault"
    },
    ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_vault"
    },
    trial_spawner: {
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/trial_spawner"
    },
    ominous_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/alfheim_tree/ominous_trial_spawner"
    }
};

const asflors = {
    common_chest: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/asflors/common"
    },
    structure_vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/asflors/vault"
    },
    structure_ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/asflors/ominous_vault"
    },
    asflors_sword: {
        image: "/images/features/item/sword.webp",
        tag: "#yggdrasil:structure/asflors/asflors_sword"
    }
};

const runic = {
    dark_elven_bow: {
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/dark_elven_bow"
    },
    twilight_bow: {
        image: "/images/features/item/bow.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/twilight_of_yggdrasil_bow"
    },
    library: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/library"
    },
    random: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/random"
    },
    shulker: {
        image: "/images/features/block/chest.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/shulker"
    },
    trial: {
        image: "/images/features/block/trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/trial"
    },
    vault: {
        image: "/images/features/block/vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/vault"
    },
    ominous_trial: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_trial"
    },
    ominous_vault: {
        image: "/images/features/block/ominous_vault.webp",
        tag: "#yggdrasil:structure/runic_labyrinth/ominous_vault"
    }
};

const runicFracture = {
    boss_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_fracture/boss_trial_spawner"
    },
    monster_trial_spawner: {
        image: "/images/features/block/ominous_trial_spawner.webp",
        tag: "#yggdrasil:structure/runic_fracture/monster_trial_spawner"
    }
};

const yggdrasilEquipmentTags = [
    "#yggdrasil:equipment/item/bow",
    "#yggdrasil:equipment/item/sword",
    "#yggdrasil:equipment/item/helmet",
    "#yggdrasil:equipment/item/chestplate",
    "#yggdrasil:equipment/item/leggings",
    "#yggdrasil:equipment/item/boots"
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/yggdrasil")({
    component: EnchantmentYggdrasilPage
});

function EnchantmentYggdrasilPage() {
    const t = useTranslate();

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolCategory title={t("yggdrasil:alfheim.title")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-100">
                    <ToolSlot
                        image="/images/features/title/yg.webp"
                        title={t("yggdrasil:yggdrasil_mob_equipment.title")}
                        description={t("yggdrasil:yggdrasil_mob_equipment.description")}
                        action={CoreAction.toggleAllValuesInList("tags", yggdrasilEquipmentTags)}
                        renderer={(el: EnchantmentProps) => yggdrasilEquipmentTags.some((tag) => el.tags.includes(tag))}
                    />

                    {Object.entries(alfheim).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={t(`yggdrasil:${key}.title`)}
                            description={t(`yggdrasil:${key}.description`)}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </div>
            </ToolCategory>

            <ToolCategory title={t("yggdrasil:asflors.title")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-76">
                    {Object.entries(asflors).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={t(`yggdrasil:${key}.title`)}
                            description={t(`yggdrasil:${key}.description`)}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </div>
            </ToolCategory>

            <ToolCategory title={t("yggdrasil:runic_fracture.title")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-100">
                    {Object.entries(runicFracture).map(([key, value]) => (
                        <ToolSlot
                            key={value.tag}
                            title={t(`yggdrasil:${key}.title`)}
                            description={t(`yggdrasil:${key}.description`)}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </div>
            </ToolCategory>

            <ToolCategory title={t("yggdrasil:runic_laby.title")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-100">
                    {Object.entries(runic).map(([key, value]) => (
                        <ToolInline
                            key={value.tag}
                            title={t(`yggdrasil:runic_laby.${key}.title`)}
                            description={t(`yggdrasil:runic_laby.${key}.description`)}
                            image={value.image}
                            action={CoreAction.toggleValue("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                        />
                    ))}
                </div>
            </ToolCategory>
        </div>
    );
}
