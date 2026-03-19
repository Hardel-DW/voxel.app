import { readFile, type UnwatchFn, watchImmediate, type WatchEvent } from "@tauri-apps/plugin-fs";
import { Datapack, Logger } from "@voxelio/breeze";
import { Differ } from "@voxelio/diff";
import { logger } from "@/lib/store/DebugStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { clearLastWritten, getLastWrittenContent } from "@/lib/utils/saveDatapack";

let unwatchFn: UnwatchFn | null = null;
let currentBasePath: string | null = null;

const decoder = new TextDecoder();

const isJsonEqual = (a: Uint8Array, b: Uint8Array): boolean => {
    try {
        const jsonA = JSON.parse(decoder.decode(a));
        const jsonB = JSON.parse(decoder.decode(b));
        return new Differ(jsonA, jsonB).diff().length === 0;
    } catch {
        return false;
    }
};

const toRelativePath = (absolutePath: string, basePath: string): string => {
    return absolutePath.replace(basePath, "").replace(/^[/\\]+/, "").replace(/\\/g, "/");
};

const processFile = async (absolutePath: string, basePath: string): Promise<boolean> => {
    if (!absolutePath.endsWith(".json")) return false;

    const relativePath = toRelativePath(absolutePath, basePath);
    if (!relativePath.startsWith("data/") && !relativePath.startsWith("assets/")) return false;

    try {
        const diskContent = await readFile(absolutePath);
        const lastWritten = getLastWrittenContent(relativePath);

        if (lastWritten && isJsonEqual(diskContent, lastWritten)) {
            clearLastWritten(relativePath);
            logger.info().cat("Watcher").msg(`Skip (Studio write): ${relativePath}`).send();
            return false;
        }

        const { files } = useConfiguratorStore.getState();
        const updatedFiles = { ...files, [relativePath]: diskContent };

        const datapack = new Datapack(updatedFiles);
        const { elements, version } = datapack.parse();
        const breezeLogger = new Logger(updatedFiles);

        useConfiguratorStore.setState({
            files: updatedFiles,
            elements,
            version,
            logger: breezeLogger,
            registryCache: new Map()
        });

        logger.success().cat("Watcher").msg(`Synced: ${relativePath}`).send();
        return true;
    } catch {
        logger.error().cat("Watcher").msg(`Failed to read: ${relativePath}`).send();
        return false;
    }
};

const handleWatchEvent = (basePath: string) => (event: WatchEvent) => {
    for (const path of event.paths) {
        processFile(path, basePath);
    }
};

export const startWatching = async (folderPath: string): Promise<void> => {
    stopWatching();
    currentBasePath = folderPath;

    const dataPath = `${folderPath}/data`;
    const assetsPath = `${folderPath}/assets`;

    const handler = handleWatchEvent(folderPath);

    const unwatchData = await watchImmediate(dataPath, handler, { recursive: true }).catch(() => null);
    const unwatchAssets = await watchImmediate(assetsPath, handler, { recursive: true }).catch(() => null);

    unwatchFn = () => {
        unwatchData?.();
        unwatchAssets?.();
    };

    logger.success().cat("Watcher").msg("File watcher started").with({ path: folderPath }).send();
};

export const stopWatching = (): void => {
    if (unwatchFn) {
        unwatchFn();
        unwatchFn = null;
        logger.info().cat("Watcher").msg("File watcher stopped").send();
    }
    currentBasePath = null;
};

export const isWatching = (): boolean => unwatchFn !== null;
export const getWatchedPath = (): string | null => currentBasePath;
