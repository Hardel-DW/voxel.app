import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { isVoxel } from "@voxelio/breeze";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { buildEnchantmentTree } from "@/components/tools/concept/enchantment/buildEnchantmentTree";
import { SLOT_CONFIGS } from "@/components/tools/concept/enchantment/slots";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { CONCEPTS } from "@/components/tools/elements";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getCurrentElement, getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { TreeSidebar } from "@/components/ui/tree/TreeSidebar";
import { getEnchantableKeys } from "@/lib/data/tags";
import { useElementsByType } from "@/lib/hook/useElementsByType";
import { t } from "@/lib/i18n";

const concept = CONCEPTS.find((c) => c.registry === "enchantment");
if (!concept) throw new Error("Enchantment concept not found");
const overviewRoute = concept.overview;
const detailRoute = concept.tabs[0].url;
const tabRoutes = concept.tabs.map((t) => t.url);
const changesRoute = "/editor/enchantment/changes";
const elementIcon = "/images/features/item/enchanted_book.webp";
const SLOT_FOLDER_ICONS = Object.fromEntries(SLOT_CONFIGS.map((c) => [c.id, c.image]));

export const Route = createFileRoute("/editor/enchantment")({
    component: EnchantmentLayout,
    notFoundComponent: NotFoundStudio
});

function EnchantmentLayout() {
    const { sidebarView, setSidebarView, filterPath, viewMode, setViewMode } = useEditorUiStore();
    const { setContainerRef } = useDynamicIsland();
    const location = useLocation();
    const navigate = useNavigate();
    const elements = useElementsByType("enchantment");
    const version = useConfiguratorStore((s) => s.version) ?? 61;
    const tree = buildEnchantmentTree(elements, sidebarView, version);
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, "enchantment").length);
    const currentElement = useConfiguratorStore((s) => getCurrentElement(s));
    const enchantment = currentElement && isVoxel(currentElement, "enchantment") ? currentElement : undefined;
    const isOverview = location.pathname.endsWith("/overview");
    const itemFolderIcons = Object.fromEntries(getEnchantableKeys(version).map((k) => [k, `/images/features/item/${k}.webp`]));
    const folderIcons = sidebarView === "slots" ? SLOT_FOLDER_ICONS : sidebarView === "items" ? itemFolderIcons : undefined;
    const disableAutoExpand = sidebarView === "slots";

    return (
        <TreeProvider
            config={{
                overviewRoute,
                detailRoute,
                changesRoute,
                tabRoutes,
                tree,
                modifiedCount,
                elementIcon,
                folderIcons,
                disableAutoExpand
            }}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title="enchantment:overview.title" icon={elementIcon} linkTo="/editor/enchantment/overview">
                    <ToggleGroup value={sidebarView} onChange={setSidebarView} className="mt-4">
                        <ToggleGroupOption value="slots">
                            {t("enchantment.overview.sidebar.slots")}
                        </ToggleGroupOption>
                        <ToggleGroupOption value="items">
                            {t("enchantment.overview.sidebar.items")}
                        </ToggleGroupOption>
                        <ToggleGroupOption value="exclusive">
                            {t("enchantment.overview.sidebar.exclusive")}
                        </ToggleGroupOption>
                    </ToggleGroup>
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Enchantment"
                        identifier={enchantment?.identifier}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/editor/enchantment/overview" })}>
                        <Link
                            to="/editor/enchantment/simulation"
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm transition-colors cursor-pointer">
                            Simulation
                        </Link>
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
