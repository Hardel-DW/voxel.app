import { useMatches, useNavigate, useParams } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { createContext } from "react";
import { useEditorUiStore } from "@/lib/store/EditorUiStore";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useTabsStore } from "@/lib/store/TabsStore";
import type { TreeNodeType } from "@/lib/utils/tree";

interface TreeConfig {
    overviewRoute: string;
    detailRoute: string;
    changesRoute: string;
    concept: string;
    tabRoutes?: string[];
    tree: TreeNodeType;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    selectedElementId?: string | null;
    onSelectElement?: (elementId: string) => void;
    onSelectFolder?: (path: string) => void;
}

interface TreeContextValue {
    filterPath: string;
    currentElementId: string | null;
    isAllActive: boolean;
    tree: TreeNodeType;
    concept: string;
    changesRoute: string;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    selectFolder: (path: string) => void;
    selectElement: (elementId: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

export const TreeContext = createContext<TreeContextValue | null>(null);
export function TreeProvider({ config, children }: { config: TreeConfig; children: React.ReactNode }) {
    const matches = useMatches();
    const navigate = useNavigate();
    const filterPath = useEditorUiStore((s) => s.filterPath);
    const setFilterPath = useEditorUiStore((s) => s.setFilterPath);
    const currentElementId = useNavigationStore((s) => s.currentElementId);
    const openTab = useTabsStore((s) => s.openTab);
    const clearSelection = () => useNavigationStore.getState().setCurrentElementId(null);
    const isOnTab = config.tabRoutes?.some((route) => matches.map((m) => m.routeId as string).includes(route));
    const { lang } = useParams({ from: "/$lang" });

    if (isOnTab && !currentElementId) {
        const activeTab = useTabsStore.getState().getActiveTab();
        if (activeTab) {
            useNavigationStore.getState().setCurrentElementId(activeTab.elementId);
        }
    }

    const selectFolder = (path: string) => {
        if (config.onSelectFolder) {
            config.onSelectFolder(path);
            return;
        }
        setFilterPath(path);
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const selectElement = (elementId: string) => {
        if (config.onSelectElement) {
            config.onSelectElement(elementId);
            return;
        }
        const label = Identifier.fromUniqueKey(elementId).resource;
        openTab(elementId, config.detailRoute, label);
        if (!isOnTab) {
            navigate({ to: config.detailRoute, params: { lang } });
        }
    };

    const selectAll = () => {
        setFilterPath("");
        clearSelection();
        navigate({ to: config.overviewRoute, params: { lang } });
    };

    const activeElementId = config.selectedElementId !== undefined ? config.selectedElementId : currentElementId;
    const value: TreeContextValue = {
        filterPath,
        currentElementId: activeElementId ?? null,
        isAllActive: filterPath === "" && !activeElementId,
        tree: config.tree,
        concept: config.concept,
        changesRoute: config.changesRoute,
        elementIcon: config.elementIcon,
        folderIcons: config.folderIcons,
        disableAutoExpand: config.disableAutoExpand,
        selectFolder,
        selectElement,
        selectAll,
        clearSelection
    };

    return <TreeContext value={value}>{children}</TreeContext>;
}
