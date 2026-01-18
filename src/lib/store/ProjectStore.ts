import { create } from "zustand";
import { Datapack, Logger } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { useHomeStore } from "@/lib/store/HomeStore";
import { loadDatapackFromFolder, loadDatapackFromPath } from "@/lib/utils/datapack";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";

export type SourceType = "zip" | "jar" | "folder";

export interface SourceMetadata {
    path: string;
    type: SourceType;
}

export interface ProjectState {
    sourceMetadata: SourceMetadata | null;
    isDirty: boolean;
    markDirty: () => void;
    markClean: () => void;
    setSourceMetadata: (source: SourceMetadata | null) => void;
    createNewProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    sourceMetadata: null,
    isDirty: false,
    markDirty: () => set({ isDirty: true }),
    markClean: () => set({ isDirty: false }),
    setSourceMetadata: (source) => set({ sourceMetadata: source }),
    createNewProject: () => {
        const mcmeta = { pack: { pack_format: 61, description: "New Voxel Project" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const logger = new Logger(files);
        useConfiguratorStore.getState().setup({ files, elements: new Map(), version: 61, logger }, false, "New Project");
        set({ sourceMetadata: null, isDirty: false });
    }
}));

export const openDatapackFromPath = async (path: string, onSuccess: () => void) => {
    try {
        const isDir = !path.endsWith(".zip") && !path.endsWith(".jar");
        const { datapack, name, isModded, iconPath } = isDir
            ? await loadDatapackFromFolder(path)
            : await loadDatapackFromPath(path);

        const sourceType: SourceType = isDir ? "folder" : isModded ? "jar" : "zip";
        const projectType = isDir ? "folder" : isModded ? "mods" : "datapacks";
        const sourceMetadata: SourceMetadata = { path, type: sourceType };

        useConfiguratorStore.getState().setup(datapack, isModded, name);
        useProjectStore.getState().setSourceMetadata(sourceMetadata);
        useProjectStore.getState().markClean();
        useHomeStore.getState().addRecentProject({ name, path, type: projectType, icon: iconPath ?? undefined });

        onSuccess();
        toast(t("studio.success.loaded", { file: name }), TOAST.SUCCESS);
    } catch (e: unknown) {
        console.error("[openDatapackFromPath] Error:", e);
        toast(t("generic.dialog.error"), TOAST.ERROR, e instanceof Error ? e.message : t("studio.error.failed_to_upload"));
    }
};
