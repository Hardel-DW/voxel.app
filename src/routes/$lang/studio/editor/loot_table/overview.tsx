import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import LootOverviewCard from "@/components/tools/concept/loot/LootOverviewCard";
import { TextInput } from "@/components/ui/TextInput";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useFlattenedLootCache } from "@/lib/hook/useFlattenedLootItems";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { useTranslate } from "@/lib/i18n";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";
import { cn } from "@/lib/utils";
import { matchesPath } from "@/lib/utils/tree";

export const Route = createFileRoute("/$lang/studio/editor/loot_table/overview")({
    component: RouteComponent
});

function RouteComponent() {
    const t = useTranslate();
    const { filterPath, search, setSearch, viewMode } = useEditorUiStore();
    const elements = useElementsByType("loot_table");
    const { itemsMap, isLoading: cacheLoading } = useFlattenedLootCache();

    const filtered = elements.filter((el) => {
        if (!matchesPath(el.identifier, filterPath)) return false;
        if (search && !el.identifier.resource.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filtered, 16, [viewMode, filterPath, search]);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="max-w-xl sticky top-0 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("loot:overview.search")} />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 bg-zinc-950/50">
                {visibleItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                        <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <img src="/icons/search.svg" className="size-10 opacity-20 invert" alt="No results" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">{t("loot:overview.empty.title")}</h3>
                        <p className="text-zinc-500 max-w-sm text-center mb-6">{t("loot:overview.empty.description")}</p>
                    </div>
                ) : (
                    <div>
                        <div
                            className={cn(
                                "overview-grid grid gap-4",
                                viewMode === "grid" ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" : "grid-cols-1"
                            )}>
                            {visibleItems.map((element) => {
                                const id = new Identifier(element.identifier);
                                return (
                                    <LootOverviewCard
                                        key={id.toUniqueKey()}
                                        elementId={id.toUniqueKey()}
                                        items={cacheLoading ? [] : (itemsMap.get(id.toString()) ?? [])}
                                        mode={viewMode}
                                    />
                                );
                            })}
                        </div>

                        {hasMore && (
                            <div ref={ref} className="flex justify-center items-center py-8">
                                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                    <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span
                                        className="size-1.5 bg-zinc-600 rounded-full animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    />
                                    <span
                                        className="size-1.5 bg-zinc-600 rounded-full animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
