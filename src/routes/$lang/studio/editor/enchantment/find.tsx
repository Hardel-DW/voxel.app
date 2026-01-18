import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { useTranslate } from "@/lib/i18n";
import { isMinecraft, LockEntryBuilder } from "@/lib/utils/lock";

const iterationValues = [
    {
        title: "enchantment:find.enchanting_table.title",
        description: "enchantment:find.enchanting_table.description",
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.mob_equipment.title",
        description: "enchantment:find.mob_equipment.description",
        image: "/images/features/entity/zombie.webp",
        tag: "#minecraft:on_mob_spawn_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.loot_in_chests.title",
        description: "enchantment:find.loot_in_chests.description",
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.tradeable.title",
        description: "enchantment:find.tradeable.description",
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.tradeable_equipment.title",
        description: "enchantment:find.tradeable_equipment.description",
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.curse.title",
        description: "enchantment:find.curse.description",
        image: "/images/features/effect/curse.webp",
        tag: "#minecraft:curse"
    },
    {
        title: "enchantment:find.non_treasure.title",
        description: "enchantment:find.non_treasure.description",
        image: "/images/features/effect/non_treasure.webp",
        tag: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:find.treasure.title",
        description: "enchantment:find.treasure.description",
        image: "/images/features/effect/treasure.webp",
        tag: "#minecraft:treasure"
    }
];

export const Route = createFileRoute("/$lang/studio/editor/enchantment/find")({
    component: EnchantmentFindPage
});

function EnchantmentFindPage() {
    const t = useTranslate();
    const params = useParams({ from: "/$lang" });

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolSection id="behaviour" title={t("enchantment:section.find")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-92">
                    {iterationValues.map((value) => (
                        <ToolSlot
                            align="left"
                            key={value.tag}
                            action={CoreAction.toggleValueInList("tags", value.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value.tag)}
                            lock={[
                                new LockEntryBuilder()
                                    .addTextKey("enchantment:technical.lock.reason")
                                    .addCondition((el: EnchantmentProps) => (value.lock_value ? el.tags.includes(value.lock_value) : false))
                                    .build(),
                                isMinecraft
                            ]}
                            title={t(value.title)}
                            image={value.image}
                            description={t(value.description)}
                        />
                    ))}
                </div>
            </ToolSection>
            <ToolSection id="addons" title={t("enchantment:addons.description")}>
                <div className="grid gap-4 grid-auto-72">
                    <Link
                        to="/$lang/studio/editor/enchantment/dnt"
                        params={{ lang: params.lang }}
                        className="group relative overflow-hidden rounded-2xl border border-zinc-800 transition-all hover:border-zinc-600">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="/images/addons/hero/dnt.png"
                            alt="DNT"
                            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-end justify-between">
                            <div>
                                <h3 className="text-xl font-semibold uppercase tracking-wider">{t("dnt:title")}</h3>
                                <p className="text-zinc-400 text-sm">{t("dnt:description")}</p>
                            </div>
                            <img src="/images/addons/logo/dnt.webp" alt="DNT Logo" className="w-12 h-12" />
                        </div>
                    </Link>
                    <Link
                        to="/$lang/studio/editor/enchantment/yggdrasil"
                        params={{ lang: params.lang }}
                        className="group relative overflow-hidden rounded-2xl border border-zinc-800 transition-all hover:border-zinc-600">
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="/images/addons/hero/yggdrasil.png"
                            alt="Yggdrasil"
                            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-end justify-between">
                            <div>
                                <h3 className="text-xl font-semibold uppercase tracking-wider">{t("yggdrasil:title")}</h3>
                                <p className="text-zinc-400 text-sm">{t("yggdrasil:description")}</p>
                            </div>
                            <img src="/images/addons/logo/yggdrasil.webp" alt="Yggdrasil Logo" className="w-12 h-12" />
                        </div>
                    </Link>
                </div>
            </ToolSection>
        </div>
    );
}
