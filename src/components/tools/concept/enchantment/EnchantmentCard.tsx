import { Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps, TagType } from "@voxelio/breeze";
import { CoreAction, getItemFromMultipleOrOne, Identifier, TagsProcessor } from "@voxelio/breeze";
import OverviewCase from "@/components/tools/concept/enchantment/EnchantmentOverviewCase";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { useTabsStore } from "@/lib/store/TabsStore";

const findOptions = [
    {
        title: "enchantment:overview.enchanting_table",
        image: "/images/features/block/enchanting_table.webp",
        tag: "#minecraft:in_enchanting_table",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.chest",
        image: "/images/features/block/chest.webp",
        tag: "#minecraft:on_random_loot",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.tradeable",
        image: "/images/features/item/enchanted_book.webp",
        tag: "#minecraft:on_traded_equipment",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.tradeable_equipment",
        image: "/images/features/item/enchanted_item.webp",
        tag: "#minecraft:tradeable",
        lock_value: "#minecraft:non_treasure"
    },
    {
        title: "enchantment:overview.price_doubled",
        image: "/images/features/title/doubled.webp",
        tag: "#minecraft:double_trade_price",
        lock_value: "#minecraft:treasure"
    }
];

export default function EnchantmentCard({ element }: { element: EnchantmentProps }) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const { data } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);
    const elementId = new Identifier(element.identifier).toUniqueKey();
    const resourceName = new Identifier(element.identifier).toResourceName();
    const isVanilla = element.identifier.namespace === "minecraft";
    const tagId = Identifier.of(id.startsWith("#") ? id.slice(1) : id, "tags/item");
    const vanillaTags = data
        ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/item"), data: value }))
        : [];

    const merge = TagsProcessor.merge([
        { id: "vanilla", tags: vanillaTags },
        { id: "datapack", tags: datapackTags }
    ]);
    const items = isTag && merge.length > 0 ? new TagsProcessor(merge).getRecursiveValues(tagId) : [id];

    const handleConfigure = () => useTabsStore.getState().openTab(elementId, "/$lang/studio/editor/enchantment/main", resourceName);

    return (
        <div
            data-element-id={elementId}
            className="overview-card bg-zinc-950/70 border border-zinc-900 select-none relative rounded-xl p-4 flex flex-col transition-transform duration-150 ease-out hover:-translate-y-0.5 isolate">
            <div className="absolute inset-0 -z-10 brightness-10">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>

            <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {items.length === 0 ? (
                        <div className="size-10 bg-zinc-900 rounded-full animate-pulse shrink-0" />
                    ) : (
                        <div className="shrink-0">
                            <TextureRenderer id={items[0]} className="size-10" />
                        </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{resourceName}</h3>
                        <p className="text-[10px] tracking-wider minecraft-font text-zinc-400">
                            {t("enchantment:overview.level")} {element.maxLevel}
                        </p>
                    </div>
                </div>

                {!isVanilla && (
                    <SimpleSwitch
                        elementId={elementId}
                        action={CoreAction.setValue("mode", element.mode === "soft_delete" ? "normal" : "soft_delete")}
                        renderer={(el) => el.mode === "normal"}
                    />
                )}
            </div>

            <div className="pb-4">
                <div className="flex flex-wrap gap-2">
                    {findOptions.map((tag) => (
                        <OverviewCase
                            key={tag.title}
                            title={tag.title}
                            image={tag.image}
                            tag={tag.tag}
                            elementId={elementId}
                            action={CoreAction.toggleValueInList("tags", tag.tag)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(tag.lock_value) || el.tags.includes(tag.tag)}
                        />
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/enchantment/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-[background-color] duration-150 block text-center">
                    {t("configure")}
                </Link>
            </div>
        </div>
    );
}
