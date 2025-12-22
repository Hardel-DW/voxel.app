import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, homeDir, join } from "@tauri-apps/api/path";
import { exists, mkdir, readDir, readFile, stat, writeFile } from "@tauri-apps/plugin-fs";
import { extractZip } from "@voxelio/zip";

export type ClientType = "vanilla" | "modrinth" | "curseforge" | "custom";
export type ContentType = "mods" | "datapacks" | "resourcepacks";

export interface LauncherPreset {
    id: ClientType;
    name: string;
    icon: string;
    getDefaultPath: () => Promise<string>;
}

export interface InstanceInfo {
    name: string;
    path: string;
    iconPath: string | null;
    lastModified: number;
}

export interface WorldInfo {
    id: string;
    name: string;
    path: string;
    iconPath: string | null;
    lastPlayed: number;
    datapacks: PackContent[];
}

export interface PackContent {
    id: string;
    name: string;
    path: string;
    type: ContentType;
    iconPath: string | null;
    isDirectory: boolean;
}

const getAppDataParent = async (): Promise<string> => (await appDataDir()).replace(/[/\\][^/\\]+[/\\]?$/, "");

export const LAUNCHER_PRESETS: LauncherPreset[] = [
    {
        id: "vanilla",
        name: "Official Launcher",
        icon: "/icons/launchers/minecraft.svg",
        getDefaultPath: async () => join(await getAppDataParent(), ".minecraft")
    },
    {
        id: "modrinth",
        name: "Modrinth",
        icon: "/icons/launchers/modrinth.svg",
        getDefaultPath: async () => join(await getAppDataParent(), "ModrinthApp", "profiles")
    },
    {
        id: "curseforge",
        name: "CurseForge",
        icon: "/icons/launchers/curseforge.svg",
        getDefaultPath: async () => join(await homeDir(), "curseforge", "minecraft", "Instances")
    }
];

const PRESETS_MAP = new Map(LAUNCHER_PRESETS.map((p) => [p.id, p]));
export const getPresetById = (id: ClientType) => PRESETS_MAP.get(id);

async function fileExists(path: string): Promise<boolean> {
    try {
        return await exists(path);
    } catch {
        return false;
    }
}

export async function validateMinecraftInstance(path: string): Promise<boolean> {
    const checks = ["options.txt", "usercache.json", "versions"].map((f) => join(path, f).then(fileExists));
    return (await Promise.all(checks)).some(Boolean);
}

export async function scanLauncherInstances(clientType: ClientType, basePath: string): Promise<InstanceInfo[]> {
    if (clientType === "vanilla") {
        if (!(await validateMinecraftInstance(basePath))) return [];
        const stats = await stat(basePath).catch(() => null);
        const iconPath = await getMostRecentWorldIcon(basePath);
        return [{ name: ".minecraft", path: basePath, iconPath, lastModified: stats?.mtime?.getTime() ?? Date.now() }];
    }

    if (!(await fileExists(basePath))) return [];

    const entries = await readDir(basePath).catch(() => []);
    const results = await Promise.all(
        entries.filter((e) => e.isDirectory).map(async (entry): Promise<InstanceInfo | null> => {
            const instancePath = await join(basePath, entry.name);
            if (!(await validateMinecraftInstance(instancePath))) return null;
            const stats = await stat(instancePath).catch(() => null);
            return {
                name: entry.name,
                path: instancePath,
                iconPath: await getMostRecentWorldIcon(instancePath),
                lastModified: stats?.mtime?.getTime() ?? Date.now()
            };
        })
    );
    return results.filter((i): i is InstanceInfo => i !== null);
}

async function getMostRecentWorldIcon(instancePath: string): Promise<string | null> {
    const savesPath = await join(instancePath, "saves");
    if (!(await fileExists(savesPath))) return null;

    const worlds = await scanInstanceWorlds(instancePath);
    return worlds[0]?.iconPath ?? null;
}

export async function scanInstanceWorlds(instancePath: string): Promise<WorldInfo[]> {
    const savesPath = await join(instancePath, "saves");
    if (!(await fileExists(savesPath))) return [];

    const entries = await readDir(savesPath).catch(() => []);
    const results = await Promise.all(
        entries.filter((e) => e.isDirectory).map(async (entry): Promise<WorldInfo | null> => {
            const worldPath = await join(savesPath, entry.name);
            const levelDat = await join(worldPath, "level.dat");
            if (!(await fileExists(levelDat))) return null;

            const iconFile = await join(worldPath, "icon.png");
            const stats = await stat(levelDat);

            return {
                id: crypto.randomUUID(),
                name: entry.name,
                path: worldPath,
                iconPath: (await fileExists(iconFile)) ? iconFile : null,
                lastPlayed: stats.mtime?.getTime() ?? 0,
                datapacks: await scanPackFolder(await join(worldPath, "datapacks"), "datapacks")
            };
        })
    );
    return results.filter((w): w is WorldInfo => w !== null).toSorted((a, b) => b.lastPlayed - a.lastPlayed);
}

export const scanInstanceContent = async (instancePath: string, type: ContentType) =>
    scanPackFolder(await join(instancePath, type), type);

async function scanPackFolder(folderPath: string, type: ContentType): Promise<PackContent[]> {
    if (!(await fileExists(folderPath))) return [];

    const entries = await readDir(folderPath).catch(() => []);
    const results = await Promise.all(
        entries.map(async (entry): Promise<PackContent | null> => {
            const entryPath = await join(folderPath, entry.name);
            const isArchive = entry.name.endsWith(".zip") || entry.name.endsWith(".jar");
            if (!isArchive && !entry.isDirectory) return null;

            return {
                id: crypto.randomUUID(),
                name: entry.name.replace(/\.(zip|jar)$/i, ""),
                path: entryPath,
                type,
                iconPath: isArchive ? await cacheIcon(entryPath, type) : await findIconInDir(entryPath, type),
                isDirectory: entry.isDirectory
            };
        })
    );
    return results.filter((p): p is PackContent => p !== null);
}

const ICON_NAMES: Record<ContentType, string[]> = {
    mods: ["icon.png", "logo.png"],
    datapacks: ["pack.png"],
    resourcepacks: ["pack.png"]
};

async function findIconInDir(dirPath: string, type: ContentType): Promise<string | null> {
    for (const name of ICON_NAMES[type]) {
        const iconPath = await join(dirPath, name);
        if (await fileExists(iconPath)) return iconPath;
    }
    return null;
}

async function getCacheDir(): Promise<string> {
    const cacheDir = await join(await appDataDir(), "cache", "icons");
    if (!(await fileExists(cacheDir))) await mkdir(cacheDir, { recursive: true });
    return cacheDir;
}

function hashPath(path: string): string {
    const hash = path.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
    return Math.abs(hash).toString(16);
}

async function cacheIcon(archivePath: string, type: ContentType): Promise<string | null> {
    const cachedPath = await join(await getCacheDir(), `${hashPath(archivePath)}.png`);
    if (await fileExists(cachedPath)) return cachedPath;

    try {
        const extracted = await extractZip(await readFile(archivePath));
        for (const name of ICON_NAMES[type]) {
            if (extracted[name]) {
                await writeFile(cachedPath, new Uint8Array(extracted[name]));
                return cachedPath;
            }
        }
    } catch {}
    return null;
}

export function convertIconToSrc(iconPath: string | null): string | undefined {
    return iconPath ? convertFileSrc(iconPath.replaceAll("\\", "/")) : undefined;
}
