import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir, homeDir, join } from "@tauri-apps/api/path";
import { exists, readDir, stat } from "@tauri-apps/plugin-fs";
import type { ClientType } from "@/components/home/HomeStore";

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
    name: string;
    path: string;
    iconPath: string | null;
    lastPlayed: number;
}

async function getAppDataParent(): Promise<string> {
    const appData = await appDataDir();
    return appData.replace(/[/\\][^/\\]+[/\\]?$/, "");
}

async function getVanillaPath(): Promise<string> {
    return join(await getAppDataParent(), ".minecraft");
}

async function getModrinthPath(): Promise<string> {
    const appData = await getAppDataParent();
    return join(appData, "ModrinthApp", "profiles");
}

async function getCurseForgePath(): Promise<string> {
    const home = await homeDir();
    return await join(home, "curseforge", "minecraft", "Instances");
}

export const LAUNCHER_PRESETS: LauncherPreset[] = [
    {
        id: "vanilla",
        name: "Official Launcher",
        icon: "/icons/launchers/minecraft.svg",
        getDefaultPath: getVanillaPath
    },
    {
        id: "modrinth",
        name: "Modrinth",
        icon: "/icons/launchers/modrinth.svg",
        getDefaultPath: getModrinthPath
    },
    {
        id: "curseforge",
        name: "CurseForge",
        icon: "/icons/launchers/curseforge.svg",
        getDefaultPath: getCurseForgePath
    }
];

export function getPresetById(id: ClientType): LauncherPreset | undefined {
    return LAUNCHER_PRESETS.find((preset) => preset.id === id);
}

async function fileExists(path: string): Promise<boolean> {
    try {
        return await exists(path);
    } catch {
        return false;
    }
}

export async function validateMinecraftInstance(path: string): Promise<boolean> {
    const indicators = ["options.txt", "usercache.json", "versions"];
    const checks = indicators.map((file) => join(path, file).then(fileExists));
    const results = await Promise.all(checks);
    return results.some(Boolean);
}

export async function getMostRecentWorldIcon(instancePath: string): Promise<string | null> {
    const savesPath = await join(instancePath, "saves");
    if (!(await fileExists(savesPath))) return null;

    const worlds = await listInstanceWorlds(instancePath);
    if (worlds.length === 0) return null;

    const sorted = worlds.toSorted((a, b) => b.lastPlayed - a.lastPlayed);
    return sorted[0]?.iconPath ?? null;
}

export async function listInstanceWorlds(instancePath: string): Promise<WorldInfo[]> {
    const savesPath = await join(instancePath, "saves");
    if (!(await fileExists(savesPath))) return [];

    try {
        const entries = await readDir(savesPath);
        const worldPromises = entries
            .filter((entry) => entry.isDirectory)
            .map(async (entry): Promise<WorldInfo | null> => {
                const worldPath = await join(savesPath, entry.name);
                const levelDat = await join(worldPath, "level.dat");

                if (!(await fileExists(levelDat))) return null;

                const iconFile = await join(worldPath, "icon.png");
                const hasIcon = await fileExists(iconFile);
                const stats = await stat(levelDat);

                return {
                    name: entry.name,
                    path: worldPath,
                    iconPath: hasIcon ? iconFile : null,
                    lastPlayed: stats.mtime?.getTime() ?? 0
                };
            });

        const results = await Promise.all(worldPromises);
        return results.filter((w): w is WorldInfo => w !== null);
    } catch {
        return [];
    }
}

export async function scanLauncherInstances(clientType: ClientType, basePath: string): Promise<InstanceInfo[]> {
    if (clientType === "vanilla") {
        return scanVanillaInstance(basePath);
    }
    return scanMultiInstanceLauncher(basePath);
}

async function scanVanillaInstance(path: string): Promise<InstanceInfo[]> {
    const isValid = await validateMinecraftInstance(path);
    if (!isValid) return [];
    const iconPath = await getMostRecentWorldIcon(path);
    const stats = await stat(path).catch(() => null);

    return [{ name: ".minecraft", path, iconPath, lastModified: stats?.mtime?.getTime() ?? Date.now() }];
}

async function scanMultiInstanceLauncher(basePath: string): Promise<InstanceInfo[]> {
    if (!(await fileExists(basePath))) return [];

    try {
        const entries = await readDir(basePath);
        const instancePromises = entries
            .filter((entry) => entry.isDirectory)
            .map(async (entry): Promise<InstanceInfo | null> => {
                const instancePath = await join(basePath, entry.name);
                const isValid = await validateMinecraftInstance(instancePath);

                if (!isValid) return null;

                const iconPath = await getMostRecentWorldIcon(instancePath);
                const stats = await stat(instancePath).catch(() => null);

                return {
                    name: entry.name,
                    path: instancePath,
                    iconPath,
                    lastModified: stats?.mtime?.getTime() ?? Date.now()
                };
            });

        const results = await Promise.all(instancePromises);
        return results.filter((i): i is InstanceInfo => i !== null);
    } catch {
        return [];
    }
}

export function convertIconToSrc(iconPath: string | null): string | undefined {
    if (!iconPath) return undefined;
    const normalizedPath = iconPath.replaceAll("\\", "/");
    const url = convertFileSrc(normalizedPath);
    return url;
}
