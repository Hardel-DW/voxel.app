import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import RecipeOverviewCard from "@/components/tools/concept/recipe/RecipeOverviewCard";
import { TextInput } from "@/components/ui/TextInput";
import { canBlockHandleRecipeType } from "@/lib/data/recipeConfig";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { useTranslate } from "@/lib/i18n";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";

export const Route = createFileRoute("/$lang/studio/editor/recipe/overview")({
    component: Page
});

function Page() {
    const t = useTranslate();
    const { search, setSearch, filterPath } = useEditorUiStore();
    const recipeElements = useElementsByType("recipe");
    const filteredElements = recipeElements.filter((el) => {
        if (search && !el.identifier.resource.toLowerCase().includes(search.toLowerCase())) return false;
        if (!filterPath) return true;
        const parts = filterPath.split("/");
        if (parts.length === 2) return el.type === parts[1];
        return canBlockHandleRecipeType(filterPath, el.type);
    });

    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredElements, 16, [filterPath, search]);

    return (
        <div className="flex flex-col size-full">
            <div className="max-w-xl sticky top-0 z-30 px-8 py-4 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-800/50">
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("recipe:overview.search")} />
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 bg-zinc-950/50">
                {visibleItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center pb-20 opacity-60">
                        <div className="size-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <img src="/icons/search.svg" className="size-10 opacity-20 invert" alt="No results" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">{t("recipe:overview.no.recipes.found")}</h3>
                        <p className="text-zinc-500 max-w-sm text-center">{t("recipe:overview.try.adjusting.search.or.filter")}</p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                        {visibleItems.map((element) => {
                            const elementId = new Identifier(element.identifier).toUniqueKey();
                            return <RecipeOverviewCard key={elementId} element={element} elementId={elementId} />;
                        })}
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
