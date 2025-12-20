import { create } from "zustand";

interface EditorUiState {
    viewMode: string;
    search: string;
    filterPath: string;
    sidebarView: string;
    setViewMode: (mode: string) => void;
    setSearch: (search: string) => void;
    setFilterPath: (path: string) => void;
    setSidebarView: (view: string) => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
    viewMode: "grid",
    search: "",
    filterPath: "",
    sidebarView: "slots",
    setViewMode: (mode) => set({ viewMode: mode }),
    setSearch: (search) => set({ search }),
    setFilterPath: (path) => set({ filterPath: path }),
    setSidebarView: (view) => set({ sidebarView: view, filterPath: "" })
}));
