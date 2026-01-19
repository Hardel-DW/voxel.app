import { invoke } from "@tauri-apps/api/core";
import { readFile } from "@tauri-apps/plugin-fs";
import { Datapack } from "@voxelio/breeze";
import { cachePackIcon, findIconInDir } from "@/lib/utils/instance/icons";

export interface DatapackLoadResult {
    datapack: ReturnType<Datapack["parse"]>;
    name: string;
    isModded: boolean;
    iconPath: string | null;
}

const extractName = (path: string) => path.split(/[/\\]/).pop() ?? path;

const base64ToUint8Array = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

const readDirectoryRecursive = async (path: string): Promise<Record<string, Uint8Array>> => {
    const result = await invoke<Record<string, string>>("read_directory_recursive", { path });
    const files: Record<string, Uint8Array> = {};
    for (const [key, value] of Object.entries(result)) {
        files[key] = base64ToUint8Array(value);
    }
    return files;
};

export const loadDatapackFromFolder = async (path: string): Promise<DatapackLoadResult> => {
    const files = await readDirectoryRecursive(path);
    const result = new Datapack(files).parse();
    const iconPath = await findIconInDir(path, "datapacks");
    return { datapack: result, name: extractName(path), isModded: false, iconPath };
};

export const loadDatapackFromPath = async (path: string): Promise<DatapackLoadResult> => {
    const fileName = extractName(path);
    if (!fileName.endsWith(".zip") && !fileName.endsWith(".jar")) {
        throw new Error("Invalid file type. Expected .zip or .jar");
    }

    const bytes = await readFile(path);
    const file = new File([new Blob([bytes])], fileName, { type: "application/zip" });
    const result = (await Datapack.from(file)).parse();
    const isModded = fileName.endsWith(".jar");
    const iconPath = await cachePackIcon(path, isModded ? "mods" : "datapacks");
    return { datapack: result, name: fileName, isModded, iconPath };
};
