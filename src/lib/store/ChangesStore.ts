import type { Datapack, FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { create } from "zustand";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

interface ChangesState {
    compiledDatapack: Datapack | null;
    compiledFiles: Record<string, Uint8Array>;
    originalFiles: Record<string, Uint8Array>;
    diff: Map<string, FileStatus>;
    lastLoggerVersion: number;
    compile: () => void;
}

export const useChangesStore = create<ChangesState>((set, get) => ({
    compiledDatapack: null,
    compiledFiles: {},
    originalFiles: {},
    diff: new Map(),
    lastLoggerVersion: -1,
    compile: () => {
        const { files, compile, logger } = useConfiguratorStore.getState();
        const currentVersion = logger?.getVersion() ?? 0;
        if (get().lastLoggerVersion === currentVersion) return;

        const compiledDatapack = compile();
        const compiledFiles = compiledDatapack.getFiles();
        const diff = new DatapackDownloader(compiledFiles).getDiff(files);
        set({ compiledDatapack, compiledFiles, originalFiles: files, diff, lastLoggerVersion: currentVersion });
    }
}));
