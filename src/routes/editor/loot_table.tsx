import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { CONCEPTS } from "@/components/tools/elements";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/tree/TreeSidebar";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { t } from "@/lib/i18n";
import { buildTree } from "@/lib/utils/tree";

const concept = CONCEPTS.find((c) => c.registry === "loot_table");
if (!concept) throw new Error("Loot table concept not found");
const overviewRoute = concept.overview;
const detailRoute = concept.tabs[0].url;
const tabRoutes = concept.tabs.map((t) => t.url);
const changesRoute = "/editor/loot_table/changes";
export const Route = createFileRoute("/editor/loot_table")({
    component: LootTableLayout,
    notFoundComponent: NotFoundStudio
});

function LootTableLayout() {
    const { filterPath, viewMode, setViewMode } = useEditorUiStore();
    const { setContainerRef } = useDynamicIsland();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("loot_table");
    const tree = buildTree(
        elements.map((e) => e.identifier),
        true
    );
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "loot_table").length);
    const currentElement = useConfiguratorStore((s) => getCurrentElement(s));
    const lootTable = currentElement && isVoxel(currentElement, "loot_table") ? currentElement : undefined;
    const isOverview = location.pathname.endsWith("/overview");

    return (
        <TreeProvider config={{ overviewRoute, detailRoute, changesRoute, tabRoutes, tree, modifiedCount }}>
            <div className="flex size-full overflow-hidden relative isolate">
                <EditorSidebar
                    title={t("loot.overview.title")}
                    icon="/images/features/item/bundle_close.webp"
                    linkTo="/editor/loot_table/overview">
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Loot Table"
                        identifier={lootTable?.identifier}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/editor/loot_table/overview" })}>
                        <ToggleGroup value={viewMode} onChange={setViewMode}>
                            <ToggleGroupOption
                                value="grid"
                                icon={<img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="" />}
                            />
                            <ToggleGroupOption
                                value="list"
                                icon={<img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="" />}
                            />
                        </ToggleGroup>
                    </EditorHeader>
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}
