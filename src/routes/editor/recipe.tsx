import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { buildRecipeTree } from "@/components/tools/concept/recipe/buildRecipeTree";
import { RECIPE_BLOCKS } from "@/components/tools/concept/recipe/recipeConfig";
import { CONCEPTS } from "@/components/tools/elements";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/tree/TreeSidebar";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { t } from "@/lib/i18n";

const concept = CONCEPTS.find((c) => c.registry === "recipe");
if (!concept) throw new Error("Recipe concept not found");
const overviewRoute = concept.overview;
const detailRoute = concept.tabs[0].url;
const tabRoutes = concept.tabs.map((t) => t.url);
const changesRoute = "/editor/recipe/changes";
const RECIPE_ICON = "/images/features/block/crafting_table.webp";
const folderIcons: Record<string, string> = Object.fromEntries(
    RECIPE_BLOCKS.filter((b) => !b.isSpecial).flatMap((b) => {
        const icon = `/images/features/block/${Identifier.of(b.id, `none`).resource}.webp`;
        return [[b.id, icon], ...b.recipeTypes.map((t) => [t, icon])];
    })
);

export const Route = createFileRoute("/editor/recipe")({
    component: RecipeLayout,
    notFoundComponent: NotFoundStudio
});

function RecipeLayout() {
    const { filterPath } = useEditorUiStore();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("recipe");
    const tree = buildRecipeTree(elements);
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "recipe").length);
    const currentElement = useConfiguratorStore((s) => getCurrentElement(s));
    const recipe = currentElement && isVoxel(currentElement, "recipe") ? currentElement : undefined;
    const isOverview = location.pathname.endsWith("/overview");
    const { setContainerRef } = useDynamicIsland();

    return (
        <TreeProvider config={{ overviewRoute, detailRoute, changesRoute, tabRoutes, tree, modifiedCount, folderIcons }}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title={t("recipe.overview.title")} icon={RECIPE_ICON} linkTo="/editor/recipe/overview">
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Recipe"
                        identifier={recipe?.identifier}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/editor/recipe/overview" })}
                    />
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}
