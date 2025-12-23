import { join } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import { safeExists } from "@/lib/utils/instance/helpers";
import { cachePackIcon, findIconInDir } from "@/lib/utils/instance/icons";
import type { ContentCounts, ContentType, PackContent, PaginatedResult } from "@/lib/utils/instance/types";
import { PAGE_SIZE } from "@/lib/utils/instance/worlds";

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

export async function scanDatapacks(worldPath: string, page = 0): Promise<PaginatedResult<PackContent>> {
    return scanPackFolder(await join(worldPath, "datapacks"), "datapacks", page);
}

export async function scanContent(instancePath: string, type: ContentType, page = 0): Promise<PaginatedResult<PackContent>> {
    return scanPackFolder(await join(instancePath, type), type, page);
}

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
