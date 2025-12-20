import { useMatches, useNavigate } from "@tanstack/react-router";
import { createContext, use } from "react";
import { useEditorUiStore } from "@/components/tools/concept/EditorUiStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import type { TreeNodeType } from "@/lib/utils/tree";

interface TreeConfig {
    overviewRoute: string;
    detailRoute: string;
    changesRoute: string;
    tabRoutes?: string[];
    tree: TreeNodeType;
    modifiedCount: number;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
}

interface TreeContextValue {
    // State
    filterPath: string;
    currentElementId: string | null;
    isAllActive: boolean;
    // Config
    tree: TreeNodeType;
    modifiedCount: number;
    changesRoute: string;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    // Actions
    selectFolder: (path: string) => void;
    selectElement: (elementId: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ config, children }: { config: TreeConfig; children: React.ReactNode }) {
    const matches = useMatches();
    const navigate = useNavigate();
    const filterPath = useEditorUiStore((s) => s.filterPath);
    const setFilterPath = useEditorUiStore((s) => s.setFilterPath);
    const currentElementId = useConfiguratorStore((s) => s.currentElementId);
    const goto = useConfiguratorStore((s) => s.goto);
    const clearSelection = () => useConfiguratorStore.getState().setCurrentElementId(null);
    const isOnTab = config.tabRoutes?.some((route) => matches.map((m) => m.routeId as string).includes(route));

    const selectFolder = (path: string) => {
        setFilterPath(path);
        clearSelection();
        navigate({ to: config.overviewRoute });
    };

    const selectElement = (elementId: string) => {
        goto(elementId);
        if (!isOnTab) {
            navigate({ to: config.detailRoute });
        }
    };

    const selectAll = () => {
        setFilterPath("");
        clearSelection();
        navigate({ to: config.overviewRoute });
    };

    const value: TreeContextValue = {
        filterPath,
        currentElementId: currentElementId ?? null,
        isAllActive: filterPath === "" && !currentElementId,
        tree: config.tree,
        modifiedCount: config.modifiedCount,
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

export function useTree() {
    const context = use(TreeContext);
    if (!context) {
        throw new Error("useTree must be used within TreeProvider");
    }
    return context;
}
