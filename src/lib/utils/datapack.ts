import { readDir, readFile } from "@tauri-apps/plugin-fs";
import { Datapack } from "@voxelio/breeze";
import { cachePackIcon, findIconInDir } from "@/lib/utils/instance/icons";

export interface DatapackLoadResult {
    datapack: ReturnType<Datapack["parse"]>;
    name: string;
    isModded: boolean;
    iconPath: string | null;
}

const extractName = (path: string) => path.split(/[/\\]/).pop() ?? path;

const normalizePath = (path: string) => path.replace(/\\/g, "/");

const readDirRecursive = async (dirPath: string, rootPath: string): Promise<Record<string, Uint8Array>> => {
    const entries = await readDir(dirPath);
    const normalizedRoot = normalizePath(rootPath);

    const results = await Promise.all(
        entries.map(async (entry): Promise<Record<string, Uint8Array>> => {
            const fullPath = normalizePath(`${dirPath}/${entry.name}`);
            const relativePath = fullPath.slice(normalizedRoot.length + 1);

            if (entry.isDirectory) {
                return readDirRecursive(fullPath, rootPath);
            }
            return entry.isFile ? { [relativePath]: await readFile(fullPath) } : {};
        })
    );
    return Object.assign({}, ...results);
};

export const loadDatapackFromFolder = async (path: string): Promise<DatapackLoadResult> => {
    const files = await readDirRecursive(path, path);
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
