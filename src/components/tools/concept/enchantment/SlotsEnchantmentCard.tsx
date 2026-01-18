import { Link, useParams } from "@tanstack/react-router";
import type { EnchantmentProps, TagType } from "@voxelio/breeze";
import { CoreAction, getItemFromMultipleOrOne, Identifier, SlotManager, TagsProcessor } from "@voxelio/breeze";
import SlotGrid from "@/components/tools/concept/enchantment/SlotGrid";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

const SLOT_IMAGES = {
    mainhand: "/images/features/slots/mainhand.webp",
    offhand: "/images/features/slots/offhand.webp",
    head: "/images/features/slots/head.webp",
    chest: "/images/features/slots/chest.webp",
    legs: "/images/features/slots/legs.webp",
    feet: "/images/features/slots/feet.webp",
    body: "/images/features/slots/body.webp",
    saddle: "/images/features/slots/saddle.webp",
    any: "/images/features/slots/mainhand.webp",
    hand: "/images/features/slots/mainhand.webp",
    armor: "/images/features/slots/head.webp"
};

interface SlotsEnchantmentCardProps {
    element: EnchantmentProps;
}

export default function SlotsEnchantmentCard({ element }: SlotsEnchantmentCardProps) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const { data } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const datapackTags = useConfiguratorStore((state) => state.getRegistry<TagType>("tags/item"));
    const elementId = new Identifier(element.identifier).toUniqueKey();
    const { isTag, id } = getItemFromMultipleOrOne(element.supportedItems);
    const vanillaTags = data
        ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/item"), data: value }))
        : [];

    const merge = TagsProcessor.merge([
        { id: "vanilla", tags: vanillaTags },
        { id: "datapack", tags: datapackTags }
    ]);

    const tagId = Identifier.of(id.startsWith("#") ? id.slice(1) : id, "tags/item");
    const items = isTag && merge.length > 0 ? new TagsProcessor(merge).getRecursiveValues(tagId) : [id];

    const flattenedSlots = new SlotManager(element.slots).flatten();

    const handleConfigure = () => {
        useNavigationStore.getState().setCurrentElementId(elementId);
    };

    return (
        <div
            data-element-id={elementId}
            className="overview-card bg-black/35 border-t-2 border-l-2 shadow-xl shadow-black/30 border-zinc-900 select-none relative transition-all hover:ring-2 ring-zinc-900 rounded-xl p-4 h-full group flex flex-col">
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {items.length === 0 ? (
                        <div className="w-6 h-6 bg-zinc-900 rounded-full animate-pulse shrink-0" />
                    ) : (
                        <div className="shrink-0">
                            <TextureRenderer id={items[0]} className="size-10" />
                        </div>
                    )}
                    <div className="flex flex-col gap-1 justify-center">
                        <h3 className="text-sm font-semibold truncate">{new Identifier(element.identifier).toResourceName()}</h3>
                        <div className="flex items-center">
                            <div className="bg-zinc-800/20 pr-2 pl-1 py-px rounded-full border border-zinc-800">
                                <div className="flex items-center gap-1">
                                    <img src="/icons/tools/maxLevel.svg" alt="Max Level" className="invert-70 w-3 h-3" />
                                    <span className="text-xs tracking-wider text-zinc-400 font-medium">
                                        {t("enchantment:overview.level")} {element.maxLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SimpleSwitch
                    elementId={elementId}
                    action={CoreAction.setValue("mode", element.mode === "soft_delete" ? "normal" : "soft_delete")}
                    renderer={(el) => el.mode === "normal"}
                />
            </div>

            {/* Main content - Slots */}
            <div className="flex-1 flex flex-col pb-4">
                <div className="relative w-full flex justify-between items-center">
                    <div className="flex -space-x-1">
                        {flattenedSlots.map((slot, index) => (
                            <div
                                key={`${slot}-${index.toString()}`}
                                className="h-6 w-6 flex items-center justify-center p-1 bg-zinc-800/30 rounded border border-zinc-700/50">
                                <img
                                    src={SLOT_IMAGES[slot as keyof typeof SLOT_IMAGES] || SLOT_IMAGES.any}
                                    alt={slot}
                                    className="h-full pixelated"
                                />
                            </div>
                        ))}

                        {flattenedSlots.length === 0 && (
                            <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded border border-zinc-700">
                                {t("enchantment:overview.no_slots")}
                            </span>
                        )}
                    </div>
                    <Popover>
                        <PopoverTrigger>
                            <span className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                                {flattenedSlots.length > 5 ? `+${flattenedSlots.length - 5} more` : "Configure Slots"}
                            </span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col gap-4 min-w-120">
                                <div className="space-y-2 pt-2">
                                    <p className="font-semibold leading-2">{t("enchantment:slots.tooltip.title")}</p>
                                    <p className="text-xs text-zinc-400">{t("enchantment:slots.tooltip.description")}</p>
                                </div>

                                <hr />

                                <div className="py-2">
                                    <SlotGrid element={element} elementId={elementId} />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Footer - always at the bottom */}
            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/enchantment/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors block text-center">
                    {t("configure")}
                </Link>
            </div>

            {/* Background shine */}
            <div className="absolute inset-0 -z-10 brightness-30 group-hover:brightness-70 transition rounded-xl overflow-hidden">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" loading="lazy" />
            </div>
        </div>
    );
}
