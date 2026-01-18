import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { TreeSidebar } from "@/components/tools/sidebar/TreeSidebar";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { CONCEPTS } from "@/lib/data/elements";
import { RECIPE_BLOCKS } from "@/lib/data/recipeConfig";
import { useElementsIdByType } from "@/lib/hook/useElementsByType";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";
import { useNavigationStore } from "@/lib/store/NavigationStore";

const concept = "recipe";
const conceptData = CONCEPTS.find((c) => c.registry === "recipe");
if (!conceptData) throw new Error("Recipe concept not found");
const overviewRoute = conceptData.overview;
const detailRoute = conceptData.tabs[0].url;
const tabRoutes = conceptData.tabs.map((t) => t.url);
const changesRoute = "/$lang/studio/editor/changes/main";
const RECIPE_ICON = "/images/features/block/crafting_table.webp";
const folderIcons: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, "none").resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

export const Route = createFileRoute("/$lang/studio/editor/recipe")({
    component: RecipeLayout,
    notFoundComponent: NotFoundStudio
});

function RecipeLayout() {
    const { filterPath } = useEditorUiStore();
    const { lang } = Route.useParams();
    const isOverview = useLocation({ select: (loc) => loc.pathname.endsWith("/overview") });
    const navigate = useNavigate();
    const elementIds = useElementsIdByType("recipe");
    const tree = buildRecipeTree(elementIds);
    const currentElement = useNavigationStore((s) => s.currentElementId);
    const identifier = currentElement ? Identifier.fromUniqueKey(currentElement) : undefined;
    const { setContainerRef } = useDynamicIsland();

    return (
        <TreeProvider config={{ concept, overviewRoute, detailRoute, changesRoute, tabRoutes, tree, folderIcons }}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title="recipe:overview.title" icon={RECIPE_ICON} linkTo="/$lang/studio/editor/recipe/overview">
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Recipe"
                        identifier={identifier?.get()}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/recipe/overview", params: { lang } })}
                    />
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}
