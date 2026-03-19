import { Datapack, Logger } from "@voxelio/breeze";
import { create } from "zustand";
import { useHomeStore } from "@/lib/store/HomeStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { loadDatapackFromFolder, loadDatapackFromPath } from "@/lib/utils/datapack";
import { startWatching, stopWatching } from "@/lib/utils/folderWatcher";

export type SourceType = "zip" | "jar" | "folder";

export interface SourceMetadata {
    path: string;
    type: SourceType;
}

export interface ProjectState {
    sourceMetadata: SourceMetadata | null;
    setSourceMetadata: (source: SourceMetadata | null) => void;
    createNewProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    sourceMetadata: null,
    setSourceMetadata: (source) => set({ sourceMetadata: source }),
    createNewProject: () => {
        const mcmeta = { pack: { pack_format: 61, description: "New Voxel Project" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const logger = new Logger(files);
        useConfiguratorStore.getState().setup({ files, elements: new Map(), version: 61, logger }, false, "New Project");
        set({ sourceMetadata: null });
    }
}));

export const openDatapackFromPath = async (path: string, onSuccess: () => void) => {
    try {
        stopWatching();

        const isDir = !path.endsWith(".zip") && !path.endsWith(".jar");
        const { datapack, name, isModded, iconPath } = isDir ? await loadDatapackFromFolder(path) : await loadDatapackFromPath(path);

        const sourceType: SourceType = isDir ? "folder" : isModded ? "jar" : "zip";
        const projectType = isDir ? "folder" : isModded ? "mods" : "datapacks";

        useConfiguratorStore.getState().setup(datapack, isModded, name);
        useProjectStore.getState().setSourceMetadata({ path, type: sourceType });

        if (isDir) {
            await startWatching(path);
        }

        onSuccess();
        useHomeStore.getState().addRecentProject({ name, path, type: projectType, icon: iconPath ?? undefined });
    } catch (e: unknown) {
        console.error("[openDatapackFromPath] Error:", e);
    }
};
