import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import EnchantmentCard from "@/components/tools/concept/enchantment/EnchantmentCard";
import EnchantmentOverviewList from "@/components/tools/concept/enchantment/EnchantmentOverviewList";
import { viewMatchers } from "@/components/tools/concept/enchantment/viewMatchers";
import { TextInput } from "@/components/ui/TextInput";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { useTranslate } from "@/lib/i18n";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/overview")({
    component: OverviewPage
});

function OverviewPage() {
    const t = useTranslate();
    const { search, setSearch, sidebarView, filterPath, viewMode } = useEditorUiStore();
    const elements = useElementsByType("enchantment");
    const version = useConfiguratorStore((s) => s.version) ?? 61;

    const filteredElements = elements.filter((el) => {
        if (search && !el.identifier.resource.toLowerCase().includes(search.toLowerCase())) return false;
        if (!filterPath) return true;
        const [category, leaf] = filterPath.split("/");
        if (leaf) return new Identifier(el.identifier).toResourceName() === leaf;
        return viewMatchers[sidebarView]?.(el, category, version) ?? true;
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16, [viewMode, filterPath, search]);

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="max-w-xl sticky top-0 z-30 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50 flex flex-col gap-4">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("enchantment:overview.search")} />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 bg-zinc-950/50">
                {visibleItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                        <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <img src="/icons/search.svg" className="size-10 opacity-20 invert" alt="No results" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">{t("enchantment:items.no_results.title")}</h3>
                        <p className="text-zinc-500 max-w-sm text-center">{t("enchantment:items.no_results.description")}</p>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "grid gap-4",
                            viewMode === "grid" ? "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]" : "grid-cols-1"
                        )}>
                        {visibleItems.map((element) =>
                            viewMode === "list" ? (
                                <EnchantmentOverviewList key={element.identifier.resource} element={element} />
                            ) : (
                                <EnchantmentCard key={element.identifier.resource} element={element} />
                            )
                        )}
                    </div>
                )}

                {hasMore && (
                    <div ref={ref} className="flex justify-center items-center py-8">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
