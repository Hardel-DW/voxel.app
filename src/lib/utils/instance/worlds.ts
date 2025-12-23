import { join } from "@tauri-apps/api/path";
import { readDir, readFile } from "@tauri-apps/plugin-fs";
import { decompress, LazyNbtFile } from "@voxelio/snbt";
import { safeExists } from "@/lib/utils/instance/helpers";
import type { PaginatedResult, WorldInfo } from "@/lib/utils/instance/types";

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
    { image: "/images/background/minecraft/mount.webp", min: 4653, max: Infinity }
];

export function getVersionBackground(versionId: number | null): string {
    if (versionId === null) return VERSION_BACKGROUNDS[0].image;
    const match = VERSION_BACKGROUNDS.find((v) => versionId >= v.min && versionId <= v.max);
    return match?.image ?? VERSION_BACKGROUNDS[0].image;
}

interface NbtCompoundTag {
    type: number;
    entries: Map<string, unknown>;
}

interface NbtValueTag {
    type: number;
    value: number;
}

function isNbtCompound(value: unknown): value is NbtCompoundTag {
    return typeof value === "object" && value !== null && "entries" in value && (value as NbtCompoundTag).entries instanceof Map;
}

function isNbtValue(value: unknown): value is NbtValueTag {
    return typeof value === "object" && value !== null && "value" in value && typeof (value as NbtValueTag).value === "number";
}

export function getWorldVersionId(compressedData: Uint8Array): number | null {
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

export async function getFirstWorldData(instancePath: string): Promise<{ iconPath: string | null; versionId: number | null }> {
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
