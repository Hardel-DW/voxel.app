import { Store } from "@tauri-apps/plugin-store";
import { useSyncExternalStore } from "react";

interface CacheEntry<T> {
    hash: string;
    data: T;
}

interface CacheConfig<T, K = string> {
    storeName: string;
    computeHash: (key: K) => Promise<string>;
    fetch: (key: K) => Promise<T>;
    keyToString?: (key: K) => string;
}

type Subscriber = () => void;

export class CacheRegistry<T, K = string> {
    private store: Store | null = null;
    private cache = new Map<string, CacheEntry<T>>();
    private subscribers = new Set<Subscriber>();
    private syncing = new Set<string>();

    constructor(private config: CacheConfig<T, K>) {}

    async init(): Promise<void> {
        if (this.store) return;
        this.store = await Store.load(this.config.storeName);
        for (const key of await this.store.keys()) {
            const entry = await this.store.get<CacheEntry<T>>(key);
            if (entry) this.cache.set(key, entry);
        }
        this.notify();
    }

    private notify(): void {
        for (const sub of this.subscribers) sub();
    }

    private toKeyString(key: K): string {
        return this.config.keyToString?.(key) ?? String(key);
    }

    subscribe(cb: Subscriber): () => void {
        this.subscribers.add(cb);
        return () => this.subscribers.delete(cb);
    }

    get(key: string): T | undefined {
        return this.cache.get(key)?.data;
    }

    isSyncing(key: string): boolean {
        return this.syncing.has(key);
    }

    async sync(key: K, force = false): Promise<T> {
        const keyStr = this.toKeyString(key);
        const hash = await this.config.computeHash(key);
        const cached = this.cache.get(keyStr);
        if (!force && cached?.hash === hash) return cached.data;

        this.syncing.add(keyStr);
        this.notify();

        const data = await this.config.fetch(key);
        const entry: CacheEntry<T> = { hash, data };
        this.cache.set(keyStr, entry);
        await this.store?.set(keyStr, entry);
        await this.store?.save();

        this.syncing.delete(keyStr);
        this.notify();
        return data;
    }
}

export function useCacheValue<T, K>(cache: CacheRegistry<T, K>, key: string | undefined): T | undefined {
    useSyncExternalStore(
        (cb) => cache.subscribe(cb),
        () => (key ? cache.get(key) : undefined)
    );
    return key ? cache.get(key) : undefined;
}
