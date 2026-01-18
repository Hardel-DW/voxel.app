import { Link, useParams } from "@tanstack/react-router";
import { CoreAction, type FlattenedLootItem, Identifier } from "@voxelio/breeze";
import LootDetailsPopover from "@/components/tools/concept/loot/LootDetailsPopover";
import SimpleSwitch from "@/components/tools/elements/SimpleSwitch";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useTranslate } from "@/lib/i18n";
import { useTabsStore } from "@/lib/store/TabsStore";

interface LootOverviewListProps {
    elementId: string;
    items: FlattenedLootItem[];
    resourceName: string;
    color: string;
}

export default function LootOverviewList({ elementId, items, resourceName, color }: LootOverviewListProps) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const handleConfigure = () => useTabsStore.getState().openTab(elementId, "/$lang/studio/editor/loot_table/main", resourceName);
    const identifier = Identifier.fromUniqueKey(elementId);
    const pathParts = identifier.resource.split("/");
    const parentPath = pathParts.length > 1 ? pathParts.slice(0, -1).join("/") : "";
    const isVanilla = identifier.namespace === "minecraft";

    return (
        <Link
            to="/$lang/studio/editor/loot_table/main"
            params={{ lang }}
            onClick={handleConfigure}
            data-element-id={elementId}
            className="group flex items-center justify-between bg-zinc-950/30 hover:bg-zinc-900/60 border-b p-3 transition-colors first:border-t border-zinc-800/30 relative overflow-hidden cursor-pointer">
            <span
                className="absolute left-0 top-0 bottom-0 w-0.5 opacity-35"
                style={{ background: `linear-gradient(180deg, transparent, ${color}, transparent)` }}
            />
            <div className="flex items-center gap-4 flex-1 min-w-0 pl-2">
                <LootDetailsPopover items={items}>
                    <div className="flex -space-x-2 relative group/preview shrink-0 items-center h-full cursor-pointer">
                        {items.slice(0, 1).map((item, index) => (
                            <div
                                key={`${item.name}-${index}`}
                                className="transition-transform hover:scale-110 hover:z-10 flex items-center justify-center">
                                <TextureRenderer id={item.name} className="size-8 drop-shadow-md" />
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="size-8 rounded-md bg-zinc-800/50 flex items-center justify-center border border-white/5">
                                <span className="text-zinc-600 text-[10px]">0</span>
                            </div>
                        )}
                    </div>
                </LootDetailsPopover>

                <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                            {resourceName}
                        </h3>
                    </div>
                    {parentPath && (
                        <p className="text-xs text-zinc-500 truncate font-mono text-[10px] flex items-center gap-1">
                            {parentPath.split("/").map((part, index, arr) => (
                                <span key={part}>
                                    {part.charAt(0).toUpperCase() + part.slice(1)}
                                    {index < arr.length - 1 && <span className="text-zinc-700 mx-0.5">/</span>}
                                </span>
                            ))}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <kbd className="px-1 py-0.5 text-[10px] text-zinc-500 bg-zinc-900/50 border border-zinc-800/50 rounded mx-4">
                    {identifier.namespace}
                </kbd>
                {!isVanilla && (
                    <SimpleSwitch elementId={elementId} action={CoreAction.invertBoolean("disabled")} renderer={(el) => !el.disabled} />
                )}

                <div className="h-4 w-px bg-zinc-800/50 mx-2" />

                <span className="text-xs font-medium text-zinc-400 group-hover:text-white bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-1.5 transition-all text-center min-w-[80px]">
                    {t("loot:card.configure")}
                </span>
            </div>
        </Link>
    );
}
