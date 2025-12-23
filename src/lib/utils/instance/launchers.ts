import { appDataDir, homeDir, join } from "@tauri-apps/api/path";
import { readDir, readFile } from "@tauri-apps/plugin-fs";
import { safeExists, validateMinecraftInstance } from "@/lib/utils/instance/helpers";
import type { ClientType, InstanceInfo, LauncherPreset } from "@/lib/utils/instance/types";
import { getFirstWorldData } from "@/lib/utils/instance/worlds";

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
