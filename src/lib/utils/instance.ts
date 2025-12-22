import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, homeDir, join } from "@tauri-apps/api/path";
import { exists, mkdir, readDir, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { extractZip } from "@voxelio/zip";

export type ClientType = "vanilla" | "modrinth" | "curseforge" | "custom";
export type ContentType = "mods" | "datapacks" | "resourcepacks";

export const PAGE_SIZE = 20;

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
}

export interface WorldInfo {
    name: string;
    path: string;
    iconPath: string | null;
}

export interface PackContent {
    name: string;
    path: string;
    type: ContentType;
    iconPath: string | null;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    hasMore: boolean;
}

const getAppDataParent = async () => (await appDataDir()).replace(/[/\\][^/\\]+[/\\]?$/, "");

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

export const getPresetById = (id: ClientType) => LAUNCHER_PRESETS.find((p) => p.id === id);

async function safeExists(path: string): Promise<boolean> {
    try {
        return await exists(path);
    } catch {
        return false;
    }
}

export async function validateMinecraftInstance(path: string): Promise<boolean> {
    const checks = await Promise.all(["options.txt", "usercache.json", "versions"].map((f) => join(path, f).then(safeExists)));
    return checks.some(Boolean);
}

async function getFirstWorldIcon(instancePath: string): Promise<string | null> {
    const savesPath = await join(instancePath, "saves");
    if (!(await safeExists(savesPath))) return null;

    const entries = await readDir(savesPath).catch(() => []);
    for (const entry of entries.filter((e) => e.isDirectory)) {
        const iconPath = await join(savesPath, entry.name, "icon.png");
        if (await safeExists(iconPath)) return iconPath;
    }
    return null;
}

export async function scanLauncherInstances(clientType: ClientType, basePath: string): Promise<InstanceInfo[]> {
    if (clientType === "vanilla") {
        if (!(await validateMinecraftInstance(basePath))) return [];
        return [{ name: ".minecraft", path: basePath, iconPath: await getFirstWorldIcon(basePath) }];
    }

    if (!(await safeExists(basePath))) return [];
    const entries = await readDir(basePath).catch(() => []);
    const results = await Promise.all(
        entries
            .filter((e) => e.isDirectory)
            .map(async (entry): Promise<InstanceInfo | null> => {
                const instancePath = await join(basePath, entry.name);
                if (!(await validateMinecraftInstance(instancePath))) return null;
                return { name: entry.name, path: instancePath, iconPath: await getFirstWorldIcon(instancePath) };
            })
    );
    return results.filter((i): i is InstanceInfo => i !== null);
}

export async function scanWorlds(instancePath: string, page = 0): Promise<PaginatedResult<WorldInfo>> {
    const savesPath = await join(instancePath, "saves");
    if (!(await safeExists(savesPath))) return { items: [], total: 0, hasMore: false };

    const entries = await readDir(savesPath).catch(() => []);
    const dirs = entries.filter((e) => e.isDirectory);

    const start = page * PAGE_SIZE;
    const pageEntries = dirs.slice(start, start + PAGE_SIZE);

    const items = await Promise.all(
        pageEntries.map(async (entry): Promise<WorldInfo | null> => {
            const worldPath = await join(savesPath, entry.name);
            if (!(await safeExists(await join(worldPath, "level.dat")))) return null;
            const iconFile = await join(worldPath, "icon.png");
            return { name: entry.name, path: worldPath, iconPath: (await safeExists(iconFile)) ? iconFile : null };
        })
    );

    return { items: items.filter((w): w is WorldInfo => w !== null), total: dirs.length, hasMore: start + PAGE_SIZE < dirs.length };
}

export async function scanDatapacks(worldPath: string, page = 0): Promise<PaginatedResult<PackContent>> {
    return scanPackFolder(await join(worldPath, "datapacks"), "datapacks", page);
}

export async function scanContent(instancePath: string, type: ContentType, page = 0): Promise<PaginatedResult<PackContent>> {
    return scanPackFolder(await join(instancePath, type), type, page);
}

async function scanPackFolder(folderPath: string, type: ContentType, page: number): Promise<PaginatedResult<PackContent>> {
    if (!(await safeExists(folderPath))) return { items: [], total: 0, hasMore: false };

    const entries = await readDir(folderPath).catch(() => []);
    const valid = entries.filter((e) => e.isDirectory || e.name.endsWith(".zip") || e.name.endsWith(".jar"));

    const start = page * PAGE_SIZE;
    const pageEntries = valid.slice(start, start + PAGE_SIZE);

    const items = await Promise.all(
        pageEntries.map(async (entry): Promise<PackContent> => {
            const entryPath = await join(folderPath, entry.name);
            const isArchive = entry.name.endsWith(".zip") || entry.name.endsWith(".jar");
            return {
                name: entry.name.replace(/\.(zip|jar)$/i, ""),
                path: entryPath,
                type,
                iconPath: isArchive ? await cacheIcon(entryPath, type) : await findIconInDir(entryPath, type)
            };
        })
    );

    return { items, total: valid.length, hasMore: start + PAGE_SIZE < valid.length };
}

const ICON_NAMES: Record<ContentType, string[]> = {
    mods: ["icon.png", "logo.png"],
    datapacks: ["pack.png"],
    resourcepacks: ["pack.png"]
};

async function findIconInDir(dirPath: string, type: ContentType): Promise<string | null> {
    for (const name of ICON_NAMES[type]) {
        const iconPath = await join(dirPath, name);
        if (await safeExists(iconPath)) return iconPath;
    }
    return null;
}

async function getCacheDir(): Promise<string> {
    const cacheDir = await join(await appDataDir(), "cache", "icons");
    if (!(await safeExists(cacheDir))) await mkdir(cacheDir, { recursive: true });
    return cacheDir;
}

function hashPath(path: string): string {
    return Math.abs(path.split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0)).toString(16);
}

async function cacheIcon(archivePath: string, type: ContentType): Promise<string | null> {
    const cachedPath = await join(await getCacheDir(), `${hashPath(archivePath)}.png`);
    if (await safeExists(cachedPath)) return cachedPath;

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

export const convertIconToSrc = (iconPath: string | null) => (iconPath ? convertFileSrc(iconPath.replaceAll("\\", "/")) : undefined);
