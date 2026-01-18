import { create } from "zustand";

type PaintMode = "none" | "painting" | "erasing";

interface SelectedItemStore {
    item: string;
    paintMode: PaintMode;
    setItem: (item: string) => void;
    setPaintMode: (mode: PaintMode) => void;
}

export const useSelectedItemStore = create<SelectedItemStore>((set) => ({
    item: "",
    paintMode: "none",
    setItem: (item: string) => set({ item }),
    setPaintMode: (mode: PaintMode) => set({ paintMode: mode })
}));
