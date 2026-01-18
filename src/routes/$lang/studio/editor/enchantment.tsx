import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { buildEnchantmentTree } from "@/components/tools/concept/enchantment/buildEnchantmentTree";
import { EditorHeader } from "@/components/tools/concept/layout/EditorHeader";
import { EditorSidebar } from "@/components/tools/concept/layout/EditorSidebar";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { TreeSidebar } from "@/components/tools/sidebar/TreeSidebar";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { CONCEPTS } from "@/lib/data/elements";
import { SLOT_CONFIGS } from "@/lib/data/slots";
import { getEnchantableKeys } from "@/lib/data/tags";
import { useElementsIdByType } from "@/lib/hook/useElementsByType";
import { useTranslate } from "@/lib/i18n";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

const concept = "enchantment";
const conceptData = CONCEPTS.find((c) => c.registry === "enchantment");
if (!conceptData) throw new Error("Enchantment concept not found");
const overviewRoute = conceptData.overview;
const detailRoute = conceptData.tabs[0].url;
const tabRoutes = conceptData.tabs.map((t) => t.url);
const changesRoute = "/$lang/studio/editor/changes/main";
const elementIcon = "/images/features/item/enchanted_book.webp";
const SLOT_FOLDER_ICONS = Object.fromEntries(SLOT_CONFIGS.map((c) => [c.id, c.image]));

export const Route = createFileRoute("/$lang/studio/editor/enchantment")({
    component: EnchantmentLayout,
    notFoundComponent: NotFoundStudio
});

function EnchantmentLayout() {
    const t = useTranslate();
    const { sidebarView, setSidebarView, filterPath, viewMode, setViewMode } = useEditorUiStore();
    const { setContainerRef } = useDynamicIsland();
    const isOverview = useLocation({ select: (loc) => loc.pathname.endsWith("/overview") });
    const navigate = useNavigate();
    const { lang } = Route.useParams();
    const elementIds = useElementsIdByType("enchantment");
    const version = useConfiguratorStore((s) => s.version) ?? 61;
    const tree = buildEnchantmentTree(elementIds, sidebarView, version);
    const currentElement = useNavigationStore((s) => s.currentElementId);
    const identifier = currentElement ? Identifier.fromUniqueKey(currentElement) : undefined;
    const itemFolderIcons = Object.fromEntries(getEnchantableKeys(version).map((k) => [k, `/images/features/item/${k}.webp`]));
    const folderIcons = sidebarView === "slots" ? SLOT_FOLDER_ICONS : sidebarView === "items" ? itemFolderIcons : undefined;
    const disableAutoExpand = sidebarView === "slots";

    return (
        <TreeProvider
            config={{ concept, overviewRoute, detailRoute, changesRoute, tabRoutes, tree, elementIcon, folderIcons, disableAutoExpand }}>
            <div className="flex size-full overflow-hidden relative z-10 isolate">
                <EditorSidebar title="enchantment:overview.title" icon={elementIcon} linkTo="/$lang/studio/editor/enchantment/overview">
                    <ToggleGroup value={sidebarView} onChange={setSidebarView} className="mt-4">
                        <ToggleGroupOption value="slots">{t("enchantment:overview.sidebar.slots")}</ToggleGroupOption>
                        <ToggleGroupOption value="items">{t("enchantment:overview.sidebar.items")}</ToggleGroupOption>
                        <ToggleGroupOption value="exclusive">{t("enchantment:overview.sidebar.exclusive")}</ToggleGroupOption>
                    </ToggleGroup>
                    <TreeSidebar />
                </EditorSidebar>

                <main ref={setContainerRef} className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
                    <EditorHeader
                        fallbackTitle="Enchantment"
                        identifier={identifier?.get()}
                        filterPath={filterPath}
                        isOverview={isOverview}
                        onBack={() => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } })}>
                        <Link
                            to="/$lang/studio/editor/enchantment/simulation"
                            params={{ lang }}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-zinc-400 rounded-lg text-sm transition-colors cursor-pointer">
                            {t("enchantment:simulation")}
                        </Link>
                        <ToggleGroup value={viewMode} onChange={setViewMode}>
                            <ToggleGroupOption
                                value="grid"
                                icon={<img src="/icons/tools/overview/grid.svg" className="size-4 invert" alt="Grid view" />}
                            />
                            <ToggleGroupOption
                                value="list"
                                icon={<img src="/icons/tools/overview/list.svg" className="size-4 invert" alt="List view" />}
                            />
                        </ToggleGroup>
                    </EditorHeader>
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}
