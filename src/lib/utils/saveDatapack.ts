import { dirname } from "@tauri-apps/api/path";
import { mkdir, writeFile } from "@tauri-apps/plugin-fs";
import { TOAST, toast } from "@/components/ui/Toast";
import { translate } from "@/lib/i18n";
import { type SourceMetadata, useProjectStore } from "@/lib/store/ProjectStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

const ensureDir = async (path: string) => mkdir(await dirname(path), { recursive: true }).catch(() => {});

const saveArchive = async (path: string) => {
    const { compile, logger, isModded } = useConfiguratorStore.getState();
    const blob = await (await compile().generate(logger, isModded)).blob();
    await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
};

const saveFolder = async (basePath: string) => {
    const files = useConfiguratorStore.getState().compile().getFiles();
    await Promise.all(
        Object.entries(files).map(async ([relativePath, content]) => {
            const fullPath = `${basePath}/${relativePath}`;
            await ensureDir(fullPath);
            await writeFile(fullPath, content);
        })
    );
};

export const saveToSource = async (): Promise<boolean> => {
    const { sourceMetadata, markClean } = useProjectStore.getState();
    if (!sourceMetadata) {
        toast(translate("studio.error.no_source"), TOAST.ERROR);
        return false;
    }

    try {
        await (sourceMetadata.type === "folder" ? saveFolder(sourceMetadata.path) : saveArchive(sourceMetadata.path));
        markClean();
        toast(translate("studio.success.saved"), TOAST.SUCCESS);
        return true;
    } catch (error) {
        console.error("[saveToSource] Error:", error);
        toast(translate("studio.error.save_failed"), TOAST.ERROR, error instanceof Error ? error.message : String(error));
        return false;
    }
};

export const saveToPath = async (path: string, type: SourceMetadata["type"]): Promise<boolean> => {
    try {
        await (type === "folder" ? saveFolder(path) : saveArchive(path));
        useProjectStore.getState().markClean();
        toast(translate("studio.success.saved"), TOAST.SUCCESS);
        return true;
    } catch (error) {
        console.error("[saveToPath] Error:", error);
        toast(translate("studio.error.save_failed"), TOAST.ERROR, error instanceof Error ? error.message : String(error));
        return false;
    }
};
