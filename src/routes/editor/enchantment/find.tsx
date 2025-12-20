import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import { lazy, Suspense } from "react";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolReveal, { ToolRevealElement } from "@/components/tools/elements/ToolReveal";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import Loader from "@/components/ui/Loader";
import { isMinecraft, LockEntryBuilder } from "@/lib/utils/lock";
import { t } from "@/lib/i18n";

// Lazy load page components
const EnchantDNTSection = lazy(() => import("@/components/tools/concept/enchantment/EnchantDNTSection"));
const EnchantYggdrasilSection = lazy(() => import("@/components/tools/concept/enchantment/EnchantYggdrasilSection"));

const iterationValues = [
    {
        title: t("enchantment.find.enchanting_table.title"),
        description: t("enchantment.find.enchanting_table.description"),
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.mob_equipment.title"),
        description: t("enchantment.find.mob_equipment.description"),
        image: "/images/features/entity/zombie.webp",
        tag: "#minecraft:on_mob_spawn_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.loot_in_chests.title"),
        description: t("enchantment.find.loot_in_chests.description"),
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.tradeable.title"),
        description: t("enchantment.find.tradeable.description"),
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.tradeable_equipment.title"),
        description: t("enchantment.find.tradeable_equipment.description"),
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.curse.title"),
        description: t("enchantment.find.curse.description"),
        image: "/images/features/effect/curse.webp",
        tag: "#minecraft:curse"
    },
    {
        title: t("enchantment.find.non_treasure.title"),
        description: t("enchantment.find.non_treasure.description"),
        image: "/images/features/effect/non_treasure.webp",
        tag: "#minecraft:non_treasure"
    },
    {
        title: t("enchantment.find.treasure.title"),
        description: t("enchantment.find.treasure.description"),
        image: "/images/features/effect/treasure.webp",
        tag: "#minecraft:treasure"
    }
];

export const Route = createFileRoute("/editor/enchantment/find")({
    validateSearch: (search: Record<string, unknown>) => ({ tab: search.tab as "dnt" | "yggdrasil" | undefined }),
    component: EnchantmentFindPage
});

function EnchantmentFindPage() {
    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolSection id="behaviour" title={t("enchantment.section.find")}>
                <ToolGrid size="350px">
                    {iterationValues.map((value) => (
                        <ToolSlot
                            align="left"
                            key={value.tag}
                            action={CoreAction.toggleValueInList("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                            lock={[
                                new LockEntryBuilder()
                                    .addTextKey("enchantment.technical.lock.reason")
                                    .addCondition((el: EnchantmentProps) => (value.lock_value ? el.tags.includes(value.lock_value) : false))
                                    .build(),
                                isMinecraft
                            ]}
                            title={value.title}
                            image={value.image}
                            description={value.description}
                        />
                    ))}
                </ToolGrid>
            </ToolSection>
            <ToolSection id="addons" title={t("enchantment.addons.description")}>
                <ToolReveal searchParam="tab" useUrlSync={true} defaultValue="dnt">
                    <ToolRevealElement
                        id="dnt"
                        logo="/images/addons/logo/dnt.webp"
                        image="/images/addons/hero/dnt.png"
                        href="https://modrinth.com/datapack/dungeons-and-taverns"
                        title={t("dnt.title")}
                        description={t("dnt.description")}>
                        <Suspense fallback={<Loader />}>
                            <EnchantDNTSection />
                        </Suspense>
                    </ToolRevealElement>
                    <ToolRevealElement
                        id="yggdrasil"
                        logo="/images/addons/logo/yggdrasil.webp"
                        image="/images/addons/hero/yggdrasil.png"
                        href="https://modrinth.com/datapack/yggdrasil-structure"
                        title={t("yggdrasil.title")}
                        description={t("yggdrasil.description")}>
                        <Suspense fallback={<Loader />}>
                            <EnchantYggdrasilSection />
                        </Suspense>
                    </ToolRevealElement>
                </ToolReveal>
            </ToolSection>
        </div>
    );
}
