import { dirname } from "@tauri-apps/api/path";
import { mkdir, remove, writeFile } from "@tauri-apps/plugin-fs";
import { DatapackDownloader } from "@voxelio/breeze";
import { TOAST, toast } from "@/components/ui/Toast";
import { translate } from "@/lib/i18n";
import { type SourceMetadata, useProjectStore } from "@/lib/store/ProjectStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

const ensureDir = async (path: string) => mkdir(await dirname(path), { recursive: true }).catch(() => {});

/**
 * Write modified files to disk for folder mode
 * Compiles the datapack, computes diff, and writes only changed files
 */
export const syncFolderToDisk = async (): Promise<void> => {
    const { sourceMetadata } = useProjectStore.getState();
    if (!sourceMetadata || sourceMetadata.type !== "folder") return;

    const { files, compile } = useConfiguratorStore.getState();
    const compiledDatapack = compile();
    const compiledFiles = compiledDatapack.getFiles();
    const diff = new DatapackDownloader(compiledFiles).getDiff(files);

    const basePath = sourceMetadata.path;

    for (const [relativePath, status] of diff) {
        const fullPath = `${basePath}/${relativePath}`;

        if (status === "deleted") {
            await remove(fullPath).catch(() => {});
            continue;
        }

        const content = compiledFiles[relativePath];
        if (!content) continue;

        await ensureDir(fullPath);
        await writeFile(fullPath, content);
    }
};

const saveArchive = async (path: string) => {
    const { compile, logger, isModded } = useConfiguratorStore.getState();
    const blob = await (await compile().generate(logger, isModded)).blob();
    await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
};

export const saveToSource = async (): Promise<boolean> => {
    const { sourceMetadata } = useProjectStore.getState();
    if (!sourceMetadata) {
        toast(translate("studio.error.no_source"), TOAST.ERROR);
        return false;
    }

    if (sourceMetadata.type === "folder") {
        toast(translate("studio.info.folder_auto_save"), TOAST.INFO);
        return true;
    }

    try {
        await saveArchive(sourceMetadata.path);
        toast(translate("studio.success.saved"), TOAST.SUCCESS);
        return true;
    } catch (error) {
        console.error("[saveToSource] Error:", error);
        toast(translate("studio.error.save_failed"), TOAST.ERROR, error instanceof Error ? error.message : String(error));
        return false;
    }
};

export const saveToPath = async (path: string, type: SourceMetadata["type"]): Promise<boolean> => {
    if (type === "folder") {
        toast(translate("studio.info.folder_auto_save"), TOAST.INFO);
        return true;
    }

    try {
        await saveArchive(path);
        toast(translate("studio.success.saved"), TOAST.SUCCESS);
        return true;
    } catch (error) {
        console.error("[saveToPath] Error:", error);
        toast(translate("studio.error.save_failed"), TOAST.ERROR, error instanceof Error ? error.message : String(error));
        return false;
    }
};
