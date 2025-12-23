import { join } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import { CacheRegistry } from "@/lib/utils/cache";
import { getContentCounts } from "@/lib/utils/instance/content";
import { scanLauncherInstances } from "@/lib/utils/instance/launchers";
import type { ClientType, ContentCounts, InstanceInfo, InstanceKey, WorldInfo } from "@/lib/utils/instance/types";
import { scanWorlds } from "@/lib/utils/instance/worlds";

export const instanceCache = new CacheRegistry<(InstanceInfo | WorldInfo)[], InstanceKey>({
    storeName: "instance-cache.json",
    computeHash: computeInstanceHash,
    fetch: async ({ path, type }) => (type === "vanilla" ? (await scanWorlds(path)).items : await scanLauncherInstances(type, path)),
    keyToString: ({ path }) => path
});

export const countsCache = new CacheRegistry<ContentCounts, string>({
    storeName: "counts-cache.json",
    computeHash: computeCountsHash,
    fetch: getContentCounts
});

export const syncClient = (path: string, type: ClientType, force?: boolean) => instanceCache.sync({ path, type }, force);
export const syncCounts = (instancePath: string, force?: boolean) => countsCache.sync(instancePath, force);

async function computeInstanceHash({ path, type }: InstanceKey): Promise<string> {
    const target = type === "vanilla" ? await join(path, "saves") : path;
    const entries = await readDir(target).catch(() => []);
    return entries
        .filter((e) => e.isDirectory)
        .map((e) => e.name)
        .toSorted()
        .join("|");
}

async function computeCountsHash(instancePath: string): Promise<string> {
    const folders = ["saves", "mods", "datapacks", "resourcepacks"];
    const hashes = await Promise.all(
        folders.map(async (folder) => {
            const folderPath = await join(instancePath, folder);
            const entries = await readDir(folderPath).catch(() => []);
            return entries
                .map((e) => e.name)
                .toSorted()
                .join(",");
        })
    );
    return hashes.join("|");
}

export const initInstanceCache = async (): Promise<void> => {
    await Promise.all([instanceCache.init(), countsCache.init()]);
};
