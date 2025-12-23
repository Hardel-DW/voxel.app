import { join } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import { Store } from "@tauri-apps/plugin-store";
import { useSyncExternalStore } from "react";
import type { ClientType, ContentCounts, InstanceInfo, WorldInfo } from "./instance";
import { getContentCounts, scanLauncherInstances, scanWorlds } from "./instance";

export interface CachedData {
    folderHash: string;
    items: (InstanceInfo | WorldInfo)[];
}

export interface CachedCounts {
    folderHash: string;
    counts: ContentCounts;
}

type Subscriber = () => void;

class InstanceCache {
    private store: Store | null = null;
    private countsStore: Store | null = null;
    private cache = new Map<string, CachedData>();
    private countsCache = new Map<string, CachedCounts>();
    private subscribers = new Set<Subscriber>();
    private syncing = new Set<string>();

    async init(): Promise<void> {
        if (this.store) return;
        this.store = await Store.load("instance-cache.json");
        this.countsStore = await Store.load("counts-cache.json");
        for (const key of await this.store.keys()) {
            const data = await this.store.get<CachedData>(key);
            if (data) this.cache.set(key, data);
        }
        for (const key of await this.countsStore.keys()) {
            const data = await this.countsStore.get<CachedCounts>(key);
            if (data) this.countsCache.set(key, data);
        }
        this.notify();
    }

    private notify(): void {
        for (const sub of this.subscribers) sub();
    }

    subscribe(cb: Subscriber): () => void {
        this.subscribers.add(cb);
        return () => this.subscribers.delete(cb);
    }

    get(path: string): CachedData | undefined {
        return this.cache.get(path);
    }

    getCounts(path: string): ContentCounts | undefined {
        return this.countsCache.get(path)?.counts;
    }

    isSyncing(path: string): boolean {
        return this.syncing.has(path);
    }

    async sync(path: string, type: ClientType, force = false): Promise<CachedData> {
        const hash = await this.computeHash(path, type);
        const cached = this.cache.get(path);
        if (!force && cached?.folderHash === hash) return cached;

        this.syncing.add(path);
        this.notify();

        const items = type === "vanilla"
            ? (await scanWorlds(path)).items
            : await scanLauncherInstances(type, path);

        const data: CachedData = { folderHash: hash, items };
        this.cache.set(path, data);
        await this.store?.set(path, data);
        await this.store?.save();

        this.syncing.delete(path);
        this.notify();
        return data;
    }

    async syncCounts(instancePath: string, force = false): Promise<ContentCounts> {
        const hash = await this.computeCountsHash(instancePath);
        const cached = this.countsCache.get(instancePath);
        if (!force && cached?.folderHash === hash) return cached.counts;

        const counts = await getContentCounts(instancePath);
        const data: CachedCounts = { folderHash: hash, counts };
        this.countsCache.set(instancePath, data);
        await this.countsStore?.set(instancePath, data);
        await this.countsStore?.save();
        this.notify();
        return counts;
    }

    private async computeHash(path: string, type: ClientType): Promise<string> {
        const target = type === "vanilla" ? await join(path, "saves") : path;
        const entries = await readDir(target).catch(() => []);
        return entries.filter((e) => e.isDirectory).map((e) => e.name).toSorted().join("|");
    }

    private async computeCountsHash(instancePath: string): Promise<string> {
        const folders = ["saves", "mods", "datapacks", "resourcepacks"];
        const hashes = await Promise.all(
            folders.map(async (folder) => {
                const folderPath = await join(instancePath, folder);
                const entries = await readDir(folderPath).catch(() => []);
                return entries.map((e) => e.name).toSorted().join(",");
            })
        );
        return hashes.join("|");
    }
}

const cache = new InstanceCache();

export const initInstanceCache = (): Promise<void> => cache.init();

export function useCachedClient(path: string): { data: CachedData | undefined; syncing: boolean } {
    useSyncExternalStore(
        (cb) => cache.subscribe(cb),
        () => cache.get(path)
    );
    return { data: cache.get(path), syncing: cache.isSyncing(path) };
}

export function useCachedCounts(path: string | undefined): ContentCounts | undefined {
    useSyncExternalStore(
        (cb) => cache.subscribe(cb),
        () => (path ? cache.getCounts(path) : undefined)
    );
    return path ? cache.getCounts(path) : undefined;
}

export const syncClient = (path: string, type: ClientType, force?: boolean): Promise<CachedData> =>
    cache.sync(path, type, force);

export const syncCounts = (instancePath: string, force?: boolean): Promise<ContentCounts> =>
    cache.syncCounts(instancePath, force);
