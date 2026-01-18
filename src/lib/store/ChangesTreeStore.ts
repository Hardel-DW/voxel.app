import { create } from "zustand";

interface ChangesTreeState {
    selectedFile: string | undefined;
    setSelectedFile: (file: string | undefined) => void;
}

export const useChangesTreeStore = create<ChangesTreeState>((set) => ({
    selectedFile: undefined,
    setSelectedFile: (file) => set({ selectedFile: file })
}));

export const useIsSelected = (filePath: string | undefined) =>
    useChangesTreeStore((s) => filePath !== undefined && s.selectedFile === filePath);
