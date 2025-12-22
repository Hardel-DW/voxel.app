import { appDataDir, join } from "@tauri-apps/api/path";
import { exists, mkdir, readDir, readFile, stat, writeFile } from "@tauri-apps/plugin-fs";
import { extractZip } from "@voxelio/zip";
import { convertIconToSrc } from "./gameInstances";

export type ContentType = "mod" | "datapack" | "resourcepack";

export interface PackContent {
    id: string;
    name: string;
    path: string;
    type: ContentType;
    iconPath: string | null;
    version?: string;
    author?: string;
    isDirectory: boolean;
}

export interface WorldContent {
    id: string;
    name: string;
    path: string;
    iconPath: string | null;
    lastPlayed: number;
    datapacks: PackContent[];
}

async function fileExists(path: string): Promise<boolean> {
    try {
        return await exists(path);
    } catch {
        return false;
    }
}

async function getCacheDir(): Promise<string> {
    const appData = await appDataDir();
    const cacheDir = await join(appData, "cache", "icons");
    if (!(await fileExists(cacheDir))) {
        await mkdir(cacheDir, { recursive: true });
    }
    return cacheDir;
}

function generateCacheKey(filePath: string): string {
    const hash = filePath.split("").reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);
    return Math.abs(hash).toString(16);
}

async function extractIconFromArchive(archivePath: string, iconNames: string[]): Promise<Uint8Array | null> {
    try {
        const fileData = await readFile(archivePath);
        const extracted = await extractZip(fileData);

        for (const iconName of iconNames) {
            const iconData = extracted[iconName];
            if (iconData) {
                return new Uint8Array(iconData);
            }
        }
        return null;
    } catch {
        return null;
    }
}

async function cacheIcon(archivePath: string, type: ContentType): Promise<string | null> {
    const cacheDir = await getCacheDir();
    const cacheKey = generateCacheKey(archivePath);
    const cachedPath = await join(cacheDir, `${cacheKey}.png`);

    if (await fileExists(cachedPath)) {
        return cachedPath;
    }

    const iconNames = type === "mod" ? ["icon.png", "logo.png"] : ["pack.png"];
    const iconData = await extractIconFromArchive(archivePath, iconNames);

    if (iconData) {
        await writeFile(cachedPath, iconData);
        return cachedPath;
    }
    return null;
}

async function scanPackFolder(folderPath: string, type: ContentType): Promise<PackContent[]> {
    if (!(await fileExists(folderPath))) return [];

    try {
        const entries = await readDir(folderPath);
        const packPromises = entries.map(async (entry): Promise<PackContent | null> => {
            const entryPath = await join(folderPath, entry.name);
            const isArchive = entry.name.endsWith(".zip") || entry.name.endsWith(".jar");
            const isDir = entry.isDirectory;

            if (!isArchive && !isDir) return null;

            let iconPath: string | null = null;

            if (isArchive) {
                iconPath = await cacheIcon(entryPath, type);
            } else if (isDir) {
                const iconNames = type === "mod" ? ["icon.png", "logo.png"] : ["pack.png"];
                for (const iconName of iconNames) {
                    const dirIconPath = await join(entryPath, iconName);
                    if (await fileExists(dirIconPath)) {
                        iconPath = dirIconPath;
                        break;
                    }
                }
            }

            const name = entry.name.replace(/\.(zip|jar)$/i, "");

            return {
                id: crypto.randomUUID(),
                name,
                path: entryPath,
                type,
                iconPath,
                isDirectory: isDir
            };
        });

        const results = await Promise.all(packPromises);
        return results.filter((p): p is PackContent => p !== null);
    } catch {
        return [];
    }
}

export async function scanInstanceMods(instancePath: string): Promise<PackContent[]> {
    const modsPath = await join(instancePath, "mods");
    return scanPackFolder(modsPath, "mod");
}

export async function scanInstanceResourcePacks(instancePath: string): Promise<PackContent[]> {
    const resourcepacksPath = await join(instancePath, "resourcepacks");
    return scanPackFolder(resourcepacksPath, "resourcepack");
}

export async function scanInstanceGlobalDatapacks(instancePath: string): Promise<PackContent[]> {
    const datapacksPath = await join(instancePath, "datapacks");
    return scanPackFolder(datapacksPath, "datapack");
}

export async function scanWorldDatapacks(worldPath: string): Promise<PackContent[]> {
    const datapacksPath = await join(worldPath, "datapacks");
    return scanPackFolder(datapacksPath, "datapack");
}

export async function scanInstanceWorlds(instancePath: string): Promise<WorldContent[]> {
    const savesPath = await join(instancePath, "saves");
    if (!(await fileExists(savesPath))) return [];

    try {
        const entries = await readDir(savesPath);
        const worldPromises = entries
            .filter((entry) => entry.isDirectory)
            .map(async (entry): Promise<WorldContent | null> => {
                const worldPath = await join(savesPath, entry.name);
                const levelDat = await join(worldPath, "level.dat");

                if (!(await fileExists(levelDat))) return null;

                const iconFile = await join(worldPath, "icon.png");
                const hasIcon = await fileExists(iconFile);
                const stats = await stat(levelDat);
                const datapacks = await scanWorldDatapacks(worldPath);

                return {
                    id: crypto.randomUUID(),
                    name: entry.name,
                    path: worldPath,
                    iconPath: hasIcon ? iconFile : null,
                    lastPlayed: stats.mtime?.getTime() ?? 0,
                    datapacks
                };
            });

        const results = await Promise.all(worldPromises);
        return results.filter((w): w is WorldContent => w !== null).toSorted((a, b) => b.lastPlayed - a.lastPlayed);
    } catch {
        return [];
    }
}

export function getPackIconSrc(pack: PackContent): string | undefined {
    return convertIconToSrc(pack.iconPath);
}

export function getWorldIconSrc(world: WorldContent): string | undefined {
    return convertIconToSrc(world.iconPath);
}
