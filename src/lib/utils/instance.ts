import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, homeDir, join } from "@tauri-apps/api/path";
import { exists, mkdir, readDir, readFile, remove, writeFile } from "@tauri-apps/plugin-fs";
import { decompress, LazyNbtFile } from "@voxelio/snbt";
import { extractZip } from "@voxelio/zip";

export type ClientType = "vanilla" | "modrinth" | "curseforge" | "custom";
export type ContentType = "mods" | "datapacks" | "resourcepacks";

export const PAGE_SIZE = 20;

const VERSION_BACKGROUNDS = [
    { image: "/images/background/minecraft/default.webp", min: 0, max: 3462 },
    { image: "/images/background/minecraft/tale.webp", min: 3463, max: 3940 },
    { image: "/images/background/minecraft/trial.webp", min: 3941, max: 4057 },
    { image: "/images/background/minecraft/bundle.webp", min: 4058, max: 4173 },
    { image: "/images/background/minecraft/garden.webp", min: 4174, max: 4297 },
    { image: "/images/background/minecraft/spring.webp", min: 4298, max: 4425 },
    { image: "/images/background/minecraft/skies.webp", min: 4426, max: 4540 },
    { image: "/images/background/minecraft/copper.webp", min: 4541, max: 4652 },
    { image: "/images/background/minecraft/mount.webp", min: 4653, max: Infinity },
];

export function getVersionBackground(versionId: number | null): string {
    if (versionId === null) return VERSION_BACKGROUNDS[0].image;
    const match = VERSION_BACKGROUNDS.find((v) => versionId >= v.min && versionId <= v.max);
    return match?.image ?? VERSION_BACKGROUNDS[0].image;
}

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
    iconUrl: string | null;
    versionId: number | null;
}

export interface WorldInfo {
    name: string;
    path: string;
    iconPath: string | null;
    versionId: number | null;
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

export interface ContentCounts {
    worlds: number;
    mods: number;
    datapacks: number;
    resourcepacks: number;
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

async function getFirstWorldData(instancePath: string): Promise<{ iconPath: string | null; versionId: number | null }> {
    const savesPath = await join(instancePath, "saves");
    if (!(await safeExists(savesPath))) return { iconPath: null, versionId: null };

    const entries = await readDir(savesPath).catch(() => []);
    for (const entry of entries.filter((e) => e.isDirectory)) {
        const worldPath = await join(savesPath, entry.name);
        const levelDatPath = await join(worldPath, "level.dat");
        if (!(await safeExists(levelDatPath))) continue;

        const levelData = await readFile(levelDatPath);
        const versionId = getWorldVersionId(new Uint8Array(levelData));
        const iconFile = await join(worldPath, "icon.png");
        const iconPath = (await safeExists(iconFile)) ? iconFile : null;
        return { iconPath, versionId };
    }
    return { iconPath: null, versionId: null };
}

async function getCurseForgeThumbnail(instancePath: string): Promise<string | null> {
    const jsonPath = await join(instancePath, "minecraftinstance.json");
    if (!(await safeExists(jsonPath))) return null;

    try {
        const data = await readFile(jsonPath);
        const text = new TextDecoder().decode(data);
        const match = /"thumbnailUrl"\s*:\s*"([^"]+)"/.exec(text);
        return match?.[1] ?? null;
    } catch {
        return null;
    }
}

export async function scanLauncherInstances(clientType: ClientType, basePath: string): Promise<InstanceInfo[]> {
    if (clientType === "vanilla") {
        if (!(await validateMinecraftInstance(basePath))) return [];
        const { iconPath, versionId } = await getFirstWorldData(basePath);
        return [{ name: ".minecraft", path: basePath, iconPath, iconUrl: null, versionId }];
    }

    if (!(await safeExists(basePath))) return [];
    const entries = await readDir(basePath).catch(() => []);
    const results = await Promise.all(
        entries
            .filter((e) => e.isDirectory)
            .map(async (entry): Promise<InstanceInfo | null> => {
                const instancePath = await join(basePath, entry.name);
                if (!(await validateMinecraftInstance(instancePath))) return null;

                if (clientType === "curseforge") {
                    const iconUrl = await getCurseForgeThumbnail(instancePath);
                    if (iconUrl) return { name: entry.name, path: instancePath, iconPath: null, iconUrl, versionId: null };
                }

                const { iconPath, versionId } = await getFirstWorldData(instancePath);
                return { name: entry.name, path: instancePath, iconPath, iconUrl: null, versionId };
            })
    );
    return results.filter((i): i is InstanceInfo => i !== null);
}

interface NbtCompoundTag {
    type: number;
    entries: Map<string, unknown>;
}

function isNbtCompound(value: unknown): value is NbtCompoundTag {
    return typeof value === "object" && value !== null && "entries" in value && (value as NbtCompoundTag).entries instanceof Map;
}

interface NbtValueTag {
    type: number;
    value: number;
}

function isNbtValue(value: unknown): value is NbtValueTag {
    return typeof value === "object" && value !== null && "value" in value && typeof (value as NbtValueTag).value === "number";
}

function getWorldVersionId(compressedData: Uint8Array): number | null {
    try {
        const data = decompress(compressedData);
        const lazy = new LazyNbtFile(data);
        const dataTag = lazy.get("Data");
        if (!isNbtCompound(dataTag)) return null;

        const versionTag = dataTag.entries.get("Version");
        if (!isNbtCompound(versionTag)) return null;

        const idTag = versionTag.entries.get("Id");
        if (!isNbtValue(idTag)) return null;

        return idTag.value;
    } catch {
        return null;
    }
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
            const levelDatPath = await join(worldPath, "level.dat");
            if (!(await safeExists(levelDatPath))) return null;
            const iconFile = await join(worldPath, "icon.png");
            const levelData = await readFile(levelDatPath);
            const versionId = getWorldVersionId(new Uint8Array(levelData));
            return {
                name: entry.name,
                path: worldPath,
                iconPath: (await safeExists(iconFile)) ? iconFile : null,
                versionId
            };
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

function isValidPackEntry(entry: { name: string; isDirectory: boolean }, type: ContentType): boolean {
    if (entry.isDirectory) return true;
    if (type === "mods") return entry.name.endsWith(".jar");
    return entry.name.endsWith(".zip") || entry.name.endsWith(".jar");
}

async function scanPackFolder(folderPath: string, type: ContentType, page: number): Promise<PaginatedResult<PackContent>> {
    if (!(await safeExists(folderPath))) return { items: [], total: 0, hasMore: false };

    const entries = await readDir(folderPath).catch(() => []);
    const valid = entries.filter((e) => isValidPackEntry(e, type));
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
                iconPath: isArchive ? await cachePackIcon(entryPath, type) : await findIconInDir(entryPath, type)
            };
        })
    );

    return { items, total: valid.length, hasMore: start + PAGE_SIZE < valid.length };
}

const ICON_FALLBACKS: Record<ContentType, string[]> = {
    mods: ["icon.png", "logo.png"],
    datapacks: ["pack.png"],
    resourcepacks: ["pack.png"]
};

interface ModLoaderMeta {
    metaFile: string;
    getIconPath: (content: string) => string | null;
}

const MOD_LOADERS: ModLoaderMeta[] = [
    {
        metaFile: "fabric.mod.json",
        getIconPath: (content) => {
            const match = /"icon"\s*:\s*"([^"]+)"/.exec(content);
            return match?.[1] ?? null;
        }
    },
    {
        metaFile: "quilt.mod.json",
        getIconPath: (content) => {
            const match = /"icon"\s*:\s*"([^"]+)"/.exec(content);
            return match?.[1] ?? null;
        }
    },
    {
        metaFile: "META-INF/neoforge.mods.toml",
        getIconPath: (content) => {
            const match = /logoFile\s*=\s*"([^"]+)"/.exec(content);
            return match?.[1] ?? null;
        }
    },
    {
        metaFile: "META-INF/mods.toml",
        getIconPath: (content) => {
            const match = /logoFile\s*=\s*"([^"]+)"/.exec(content);
            return match?.[1] ?? null;
        }
    }
];

function findModIcon(files: Record<string, ArrayBuffer>): Uint8Array | null {
    for (const loader of MOD_LOADERS) {
        const metaContent = files[loader.metaFile];
        if (!metaContent) continue;

        const text = new TextDecoder().decode(metaContent);
        const iconPath = loader.getIconPath(text);
        if (iconPath && files[iconPath]) {
            return new Uint8Array(files[iconPath]);
        }
    }
    return null;
}

async function findIconInDir(dirPath: string, type: ContentType): Promise<string | null> {
    for (const name of ICON_FALLBACKS[type]) {
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

export async function cachePackIcon(archivePath: string, type: ContentType): Promise<string | null> {
    const cachedPath = await join(await getCacheDir(), `${hashPath(archivePath)}.png`);
    if (await safeExists(cachedPath)) return cachedPath;

    const extracted = await extractZip(await readFile(archivePath));

    // For mods, try loader-specific metadata first
    if (type === "mods") {
        const modIcon = findModIcon(extracted);
        if (modIcon) {
            await writeFile(cachedPath, modIcon);
            return cachedPath;
        }
    }

    // Fallback to standard icon names
    for (const name of ICON_FALLBACKS[type]) {
        if (extracted[name]) {
            await writeFile(cachedPath, new Uint8Array(extracted[name]));
            return cachedPath;
        }
    }

    return null;
}

export async function removeCachedIcon(archivePath: string): Promise<void> {
    const cachedPath = await join(await getCacheDir(), `${hashPath(archivePath)}.png`);
    if (await safeExists(cachedPath)) {
        await remove(cachedPath).catch(() => { });
    }
}

export const convertIconToSrc = (iconPath: string | null) => (iconPath ? convertFileSrc(iconPath.replaceAll("\\", "/")) : undefined);

async function countDirEntries(path: string, filter?: (name: string) => boolean): Promise<number> {
    if (!(await safeExists(path))) return 0;
    const entries = await readDir(path).catch(() => []);
    return filter ? entries.filter((e) => filter(e.name)).length : entries.filter((e) => e.isDirectory).length;
}

export async function getContentCounts(instancePath: string): Promise<ContentCounts> {
    const savesPath = await join(instancePath, "saves");
    const modsPath = await join(instancePath, "mods");
    const datapacksPath = await join(instancePath, "datapacks");
    const resourcepacksPath = await join(instancePath, "resourcepacks");

    const isModFile = (name: string) => name.endsWith(".jar") || !name.includes(".");
    const isPackFile = (name: string) => name.endsWith(".zip") || name.endsWith(".jar") || !name.includes(".");

    const [worlds, mods, datapacks, resourcepacks] = await Promise.all([
        countDirEntries(savesPath),
        countDirEntries(modsPath, isModFile),
        countDirEntries(datapacksPath, isPackFile),
        countDirEntries(resourcepacksPath, isPackFile)
    ]);

    return { worlds, mods, datapacks, resourcepacks };
}
