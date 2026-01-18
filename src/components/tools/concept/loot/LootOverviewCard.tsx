import { Link, useParams } from "@tanstack/react-router";
import type { FlattenedLootItem } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import LootDetailsPopover from "@/components/tools/concept/loot/LootDetailsPopover";
import LootOverviewList from "@/components/tools/concept/loot/LootOverviewList";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useTranslate } from "@/lib/i18n";
import { useTabsStore } from "@/lib/store/TabsStore";
import { hueToHsl, stringToColor } from "@/lib/utils/color";

interface LootOverviewCardProps {
    elementId: string;
    items: FlattenedLootItem[];
    mode?: string;
}

export default function LootOverviewCard({ elementId, items, mode }: LootOverviewCardProps) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const identifier = Identifier.fromUniqueKey(elementId);
    const resourceName = identifier.toResourceName();
    const pathParts = identifier.resource.split("/");
    const parentPath = pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";
    const firstFolder = pathParts.length > 1 ? pathParts[0] : "";
    const colorKey = firstFolder ? `${identifier.namespace}:${firstFolder}` : identifier.namespace;
    const pathColor = hueToHsl(stringToColor(colorKey), 50, 50);
    const isVanilla = identifier.namespace === "minecraft";

    const handleConfigure = () => useTabsStore.getState().openTab(elementId, "/$lang/studio/editor/loot_table/main", resourceName);

    if (mode === "list") {
        return <LootOverviewList elementId={elementId} items={items} resourceName={resourceName} color={pathColor} />;
    }

    return (
        <div
            data-element-id={elementId}
            className="overview-card bg-zinc-950/70 border border-zinc-900 select-none relative rounded-xl p-4 flex flex-col transition-transform duration-150 ease-out hover:-translate-y-0.5 isolate overflow-hidden">
            <span
                className="absolute h-0.5 top-0 left-0 right-0 opacity-35 rounded-full"
                style={{ background: `linear-gradient(180deg, transparent, ${pathColor}, transparent)` }}
            />
            <div className="absolute inset-0 -z-10 brightness-10">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" />
            </div>

            <div className="flex items-center justify-between pb-3">
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{resourceName}</h3>
                    {parentPath && (
                        <p className="text-xs text-zinc-500 truncate font-rubik font-bold text-[10px] flex items-center gap-1">
                            {parentPath.split("/").map((part, index, arr) => (
                                <span key={part}>
                                    {part.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    {index < arr.length - 1 && <span className="text-zinc-700 mx-0.5">/</span>}
                                </span>
                            ))}
                        </p>
                    )}
                </div>

                {!isVanilla && (
                    <SimpleSwitch elementId={elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />
                )}
            </div>

            <div className="pb-4">
                <div className="relative w-full flex justify-between items-center cursor-pointer">
                    <div className="flex -space-x-3">
                        {items.slice(0, 5).map((item, index) => (
                            <TextureRenderer key={`${item.name}-${index}`} id={item.name} className="size-10 scale-75 drop-shadow-sm" />
                        ))}
                    </div>
                    <LootDetailsPopover items={items}>
                        <button
                            type="button"
                            className="text-xs bg-zinc-900/60 border border-zinc-800 px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/60 transition-colors">
                            {t("loot:card.see_details")}
                        </button>
                    </LootDetailsPopover>
                </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                <Link
                    to="/$lang/studio/editor/loot_table/main"
                    params={{ lang }}
                    onClick={handleConfigure}
                    className="w-full cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-[background-color] duration-150 block text-center">
                    {t("loot:card.configure")}
                </Link>
            </div>
        </div>
    );
}
