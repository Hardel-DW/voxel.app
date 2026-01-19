import { appDataDir, join } from "@tauri-apps/api/path";
import { mkdir, readFile, remove, writeFile } from "@tauri-apps/plugin-fs";
import { extractZip } from "@voxelio/zip";
import { safeExists } from "@/lib/utils/instance/helpers";
import type { ContentType } from "@/lib/utils/instance/types";

const ICON_FALLBACKS: Record<ContentType, string[]> = {
    mods: ["pack.png", "icon.png", "logo.png"],
    datapacks: ["pack.png"],
    resourcepacks: ["pack.png"]
};

const MOD_META_FILES = [
    { file: "fabric.mod.json", regex: /"icon"\s*:\s*"([^"]+)"/ },
    { file: "quilt.mod.json", regex: /"icon"\s*:\s*"([^"]+)"/ },
    { file: "META-INF/neoforge.mods.toml", regex: /logoFile\s*=\s*"([^"]+)"/ },
    { file: "META-INF/mods.toml", regex: /logoFile\s*=\s*"([^"]+)"/ }
] as const;

function findModIcon(files: Record<string, Uint8Array>): Uint8Array | null {
    for (const { file, regex } of MOD_META_FILES) {
        const content = files[file];
        if (!content) continue;
        const iconPath = regex.exec(new TextDecoder().decode(content))?.[1];
        if (iconPath && files[iconPath]) return files[iconPath];
    }
    return null;
}

export async function findIconInDir(dirPath: string, type: ContentType): Promise<string | null> {
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

    if (type === "mods") {
        const modIcon = findModIcon(extracted);
        if (modIcon) {
            await writeFile(cachedPath, modIcon);
            return cachedPath;
        }
    }

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
        await remove(cachedPath).catch(() => {});
    }
}
