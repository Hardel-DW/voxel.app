import { readFile, type UnwatchFn, type WatchEvent, watch } from "@tauri-apps/plugin-fs";
import { Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

type WatchCallback = (event: WatchEvent) => void;

let unwatchFn: UnwatchFn | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const DEBOUNCE_MS = 300;

const isTagFile = (path: string) => path.includes("/tags/") || path.includes("\\tags\\");

const reloadTagFile = async (filePath: string, basePath: string) => {
    try {
        const content = await readFile(filePath);
        const relativePath = filePath.replace(basePath, "").replace(/^[/\\]/, "");
        const { files } = useConfiguratorStore.getState();
        const updatedFiles = { ...files, [relativePath]: content };
        const { elements } = new Datapack(updatedFiles).parse();
        useConfiguratorStore.setState({ files: updatedFiles, elements });
    } catch {
        console.error("[reloadTagFile] Error");
    }
};

const handleWatchEvent: (basePath: string) => WatchCallback = (basePath) => (event) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const tagPaths = event.paths.filter(isTagFile);
        for (const tagPath of tagPaths) {
            reloadTagFile(tagPath, basePath);
        }
    }, DEBOUNCE_MS);
};

export const startWatching = async (folderPath: string): Promise<void> => {
    stopWatching();
    const tagsPath = `${folderPath}/data`;
    unwatchFn = await watch(tagsPath, handleWatchEvent(folderPath), { recursive: true });
};

export const stopWatching = (): void => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }
    if (unwatchFn) {
        unwatchFn();
        unwatchFn = null;
    }
};
