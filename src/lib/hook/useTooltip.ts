import { create } from "zustand";

interface TooltipStore {
    hoveredItem?: string;
    setHoveredItem: (item?: string) => void;
    clearHoveredItem: () => void;
}

let timeoutRef: NodeJS.Timeout | null = null;

export const useTooltipStore = create<TooltipStore>((set) => ({
    hoveredItem: undefined,
    setHoveredItem: (item?: string) => {
        if (timeoutRef) clearTimeout(timeoutRef);
        if (item) return set({ hoveredItem: item });
        timeoutRef = setTimeout(() => set({ hoveredItem: undefined }), 50);
    },
    clearHoveredItem: () => {
        if (timeoutRef) clearTimeout(timeoutRef);
        set({ hoveredItem: undefined });
    }
}));
