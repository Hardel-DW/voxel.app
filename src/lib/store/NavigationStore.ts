import { create } from "zustand";

const MAX_HISTORY_SIZE = 20;

export interface NavigationState {
    currentElementId: string | null;
    navigationHistory: string[];
    navigationIndex: number;
    goto: (id: string) => void;
    back: () => void;
    forward: () => void;
    setCurrentElementId: (id: string | null) => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
    currentElementId: null,
    navigationHistory: [],
    navigationIndex: -1,
    goto: (id) => {
        const { navigationHistory, navigationIndex } = get();
        const truncated = navigationHistory.slice(0, navigationIndex + 1);
        const updated = [...truncated, id].slice(-MAX_HISTORY_SIZE);
        set({ navigationHistory: updated, navigationIndex: updated.length - 1, currentElementId: id });
    },
    back: () => {
        const { navigationHistory, navigationIndex } = get();
        if (navigationIndex <= 0) return;
        const newIndex = navigationIndex - 1;
        set({ navigationIndex: newIndex, currentElementId: navigationHistory[newIndex] });
    },
    forward: () => {
        const { navigationHistory, navigationIndex } = get();
        if (navigationIndex >= navigationHistory.length - 1) return;
        const newIndex = navigationIndex + 1;
        set({ navigationIndex: newIndex, currentElementId: navigationHistory[newIndex] });
    },
    setCurrentElementId: (currentElementId) => set({ currentElementId }),
    canGoBack: () => get().navigationIndex > 0,
    canGoForward: () => get().navigationIndex < get().navigationHistory.length - 1,
    resetNavigation: () => set({ navigationHistory: [], navigationIndex: -1, currentElementId: null })
}));
