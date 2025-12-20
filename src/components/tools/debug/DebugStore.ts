import type { Datapack } from "@voxelio/breeze";
import { analyserCollection, FileStatusComparator, Identifier } from "@voxelio/breeze";
import { create } from "zustand";
import { useConfiguratorStore } from "@/components/tools/Store";

interface DebugState {
    isDebugModalOpen: boolean;
    selectedElement: string | undefined;
    selectedRegistry: string;
    compiledDatapack: Datapack | null;
    fileStatusComparator: FileStatusComparator | null;
    registries: string[];
    format: "voxel" | "datapack" | "original" | "logs";
    search: string;
    openDebugModal: (compiledDatapack: Datapack) => void;
    closeDebugModal: () => void;
    setSelectedRegistry: (registry: string) => void;
    setSelectedElement: (uniqueKey: string | undefined) => void;
    getFilteredElements: () => string[];
    setFormat: (format: "voxel" | "datapack" | "original" | "logs") => void;
    setSearch: (search: string) => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
    isDebugModalOpen: false,
    selectedElement: undefined,
    selectedRegistry: "",
    compiledDatapack: null,
    fileStatusComparator: null,
    registries: [],
    format: "voxel",
    search: "",
    openDebugModal: (compiledDatapack) => {
        const { files, elements, logger, currentElementId } = useConfiguratorStore.getState();
        const registries = Object.keys(analyserCollection).flatMap((registry) => {
            const analyser = analyserCollection[registry as keyof typeof analyserCollection];
            return analyser.hasTag ? [registry, `tags/${registry}`] : [registry];
        });

        if (!logger) throw new Error("Logger is not initialized");
        const fileStatusComparator = new FileStatusComparator(files, elements, logger);
        const allKeys = Array.from(fileStatusComparator.getAllFileStatuses().keys());

        const selectedElement = currentElementId && allKeys.includes(currentElementId) ? currentElementId : allKeys[0];
        const selectedRegistry = Identifier.fromUniqueKey(selectedElement).registry;
        set({ isDebugModalOpen: true, compiledDatapack, fileStatusComparator, selectedRegistry, selectedElement, registries });
    },
    closeDebugModal: () => set({ isDebugModalOpen: false, compiledDatapack: null, fileStatusComparator: null }),
    setSelectedRegistry: (registry) => set({ selectedRegistry: registry }),
    setSelectedElement: (uniqueKey) => set({ selectedElement: uniqueKey }),
    setFormat: (format) => set({ format }),
    setSearch: (search) => set({ search }),
    getFilteredElements: () => {
        const { fileStatusComparator, selectedRegistry, search } = get();
        if (!fileStatusComparator) return [];
        return Array.from(fileStatusComparator.getAllFileStatuses().keys()).filter((uniqueKey) => {
            const identifier = Identifier.fromUniqueKey(uniqueKey);
            return !selectedRegistry || (identifier.registry === selectedRegistry && identifier.toString().includes(search.toLowerCase()));
        });
    }
}));
