import { create } from "zustand";
import { useNavigationStore } from "@/lib/store/NavigationStore";

export interface OpenTab {
    elementId: string;
    route: string;
    label: string;
}

const MAX_TABS = 10;

export interface TabsState {
    openTabs: OpenTab[];
    activeTabIndex: number;
    openTab: (elementId: string, route: string, label: string) => void;
    closeTab: (index: number) => void;
    switchTab: (index: number) => void;
    resetTabs: () => void;
    getActiveTab: () => OpenTab | undefined;
}

export const useTabsStore = create<TabsState>((set, get) => ({
    openTabs: [],
    activeTabIndex: -1,
    openTab: (elementId, route, label) => {
        const { openTabs } = get();
        const existingIndex = openTabs.findIndex((tab) => tab.elementId === elementId);
        if (existingIndex !== -1) {
            set({ activeTabIndex: existingIndex });
            return;
        }
        const newTab: OpenTab = { elementId, route, label };
        const updatedTabs = [...openTabs, newTab].slice(-MAX_TABS);
        set({ openTabs: updatedTabs, activeTabIndex: updatedTabs.length - 1 });
        useNavigationStore.getState().setCurrentElementId(elementId);
    },
    closeTab: (index) => {
        const { openTabs, activeTabIndex } = get();
        if (index < 0 || index >= openTabs.length) return;
        const updatedTabs = openTabs.toSpliced(index, 1);
        if (updatedTabs.length === 0) {
            set({ openTabs: [], activeTabIndex: -1 });
            return;
        }

        const newActiveIndex =
            index === activeTabIndex
                ? Math.min(index, updatedTabs.length - 1)
                : index < activeTabIndex
                  ? activeTabIndex - 1
                  : activeTabIndex;

        set({ openTabs: updatedTabs, activeTabIndex: newActiveIndex });
        useNavigationStore.getState().setCurrentElementId(updatedTabs[newActiveIndex].elementId ?? null);
    },
    switchTab: (index) => {
        const { openTabs } = get();
        if (index < 0 || index >= openTabs.length) return;
        set({ activeTabIndex: index });
        useNavigationStore.getState().setCurrentElementId(openTabs[index].elementId);
    },
    resetTabs: () => set({ openTabs: [], activeTabIndex: -1 }),
    getActiveTab: () => {
        const { openTabs, activeTabIndex } = get();
        return activeTabIndex >= 0 ? openTabs[activeTabIndex] : undefined;
    }
}));
