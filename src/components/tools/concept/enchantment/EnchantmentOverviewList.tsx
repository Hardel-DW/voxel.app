import { Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps, TagType } from "@voxelio/breeze";
import { CoreAction, getItemFromMultipleOrOne, Identifier, TagsProcessor } from "@voxelio/breeze";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { useTabsStore } from "@/lib/store/TabsStore";

interface EnchantmentOverviewListProps {
    element: EnchantmentProps;
}

export default function EnchantmentOverviewList({ element }: EnchantmentOverviewListProps) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const { data } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);
    const elementId = new Identifier(element.identifier).toUniqueKey();
    const resourceName = new Identifier(element.identifier).toResourceName();
    const fullIdentifier = new Identifier(element.identifier).toString();
    const tagId = Identifier.of(id.startsWith("#") ? id.slice(1) : id, "tags/item");
    const isVanilla = element.identifier.namespace === "minecraft";

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
        <Link
            to="/$lang/studio/editor/enchantment/main"
            params={{ lang }}
            onClick={handleConfigure}
            data-element-id={elementId}
            className="group flex items-center justify-between bg-zinc-950/30 hover:bg-zinc-900/60 border-b p-3 transition-colors first:border-t border-zinc-800/30 cursor-pointer">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex -space-x-2 relative shrink-0 items-center h-full">
                    {items.length > 0 ? (
                        <div className="transition-transform hover:scale-110 hover:z-10 flex items-center justify-center">
                            <TextureRenderer id={items[0]} className="size-8 drop-shadow-md" />
                        </div>
                    ) : (
                        <div className="size-8 rounded-md bg-zinc-800/50 flex items-center justify-center border border-white/5">
                            <span className="text-zinc-600 text-[10px]">?</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{resourceName}</h3>
                    <p className="text-xs text-zinc-500 truncate flex items-center gap-2">
                        <span className="font-mono text-[10px] opacity-60">{fullIdentifier}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[10px]">
                            {t("enchantment:overview.level")} {element.maxLevel}
                        </span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {!isVanilla && (
                    <SimpleSwitch
                        elementId={elementId}
                        action={CoreAction.setValue("mode", element.mode === "soft_delete" ? "normal" : "soft_delete")}
                        renderer={(el) => el.mode === "normal"}
                    />
                )}

                <div className="h-4 w-px bg-zinc-800/50 mx-2" />

                <span className="text-xs font-medium text-zinc-400 group-hover:text-white bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-1.5 transition-all text-center min-w-[80px]">
                    {t("configure")}
                </span>
            </div>
        </Link>
    );
}
