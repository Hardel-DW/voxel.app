import { Store } from "@tauri-apps/plugin-store";

interface CacheEntry<T> {
    hash: string;
    data: T;
}

const store = Store.load("cache.json");

export async function cachedFetch<T>(key: string, computeHash: () => Promise<string>, fetch: () => Promise<T>): Promise<T> {
    const s = await store;
    const hash = await computeHash();
    const cached = await s.get<CacheEntry<T>>(key);

    if (cached?.hash === hash) return cached.data;

    const data = await fetch();
    await s.set(key, { hash, data });
    await s.save();
    return data;
}
