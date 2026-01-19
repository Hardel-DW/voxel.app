import { convertFileSrc } from "@tauri-apps/api/core";
import { join } from "@tauri-apps/api/path";
import { exists, readDir } from "@tauri-apps/plugin-fs";

export async function hashDir(path: string): Promise<string> {
    const entries = await readDir(path).catch(() => []);
    return entries.map((e) => e.name).toSorted().join("|");
}

export async function safeExists(path: string): Promise<boolean> {
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

export const convertIconToSrc = (iconPath: string | null) => (iconPath ? convertFileSrc(iconPath.replaceAll("\\", "/")) : undefined);
