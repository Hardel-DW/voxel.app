import { type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import type { ReactElement } from "react";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useTranslate } from "@/lib/i18n";

interface LootDetailsPopoverProps {
    items: FlattenedLootItem[];
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
}

export default function LootDetailsPopover({ items, children }: LootDetailsPopoverProps) {
    const t = useTranslate();
    const itemsCount = items.length;

    return (
        <Popover className="loot-popover">
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="max-h-120 relative max-w-5xl">
                <div className="absolute inset-0 -z-10 brightness-10">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold leading-2">{t("loot:details.title")}</p>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs bg-zinc-900/50 border border-zinc-800 px-2 rounded-lg">
                                {itemsCount} {t("loot:details.items_count")}
                            </span>
                        </div>
                    </div>
                    <hr />

                    <div className="overflow-y-auto max-h-96">
                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.name}-${index}-${item.path.join("-")}`}
                                        className="bg-zinc-900/50 border border-zinc-800 rounded p-2 flex items-center gap-2">
                                        <div className="shrink-0 scale-75 size-10">
                                            <TextureRenderer id={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium text-white truncate">
                                                {Identifier.of(item.name, "not_a_registry").toResourceName()}
                                            </div>
                                            <div className="text-xs text-zinc-400 truncate">{item.name}</div>
                                            {item.path.length > 1 && (
                                                <div className="text-[10px] text-zinc-500 truncate">{item.path.join(" → ")}</div>
                                            )}
                                            {item.unresolved && (
                                                <div className="text-xs text-amber-400">{t("loot:details.unresolved")}</div>
                                            )}
                                            {item.cycle && <div className="text-xs text-red-400">{t("loot:details.cyclic")}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-zinc-400">
                                <div className="text-sm">{t("loot:details.empty")}</div>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
