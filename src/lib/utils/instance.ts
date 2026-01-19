import { join } from "@tauri-apps/api/path";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cachedFetch } from "@/lib/utils/cache";
import { getContentCounts, scanContent, scanDatapacks } from "@/lib/utils/instance/content";
import { hashDir } from "@/lib/utils/instance/helpers";
import { scanLauncherInstances } from "@/lib/utils/instance/launchers";
import type { ClientType, ContentCounts, ContentType, InstanceInfo, PackContent, PaginatedResult, WorldInfo } from "@/lib/utils/instance/types";
import { scanWorlds } from "@/lib/utils/instance/worlds";

export function useInstancesQuery(path: string | undefined, type: ClientType) {
    return useQuery<(InstanceInfo | WorldInfo)[]>({
        queryKey: ["instances", path, type],
        queryFn: async () => {
            if (!path) return [];
            const target = type === "vanilla" ? await join(path, "saves") : path;
            return cachedFetch(
                `instances:${path}:${type}`,
                () => hashDir(target),
                () => (type === "vanilla" ? scanWorlds(path).then((r) => r.items) : scanLauncherInstances(type, path))
            );
        },
        enabled: !!path,
        staleTime: Infinity
    });
}

export function useContentCountsQuery(instancePath: string | undefined) {
    return useQuery<ContentCounts>({
        queryKey: ["content-counts", instancePath],
        queryFn: async () => {
            if (!instancePath) throw new Error("instancePath is required");
            const folders = ["saves", "mods", "datapacks", "resourcepacks"];
            const hashes = await Promise.all(folders.map((f) => join(instancePath, f).then(hashDir)));
            return cachedFetch(
                `counts:${instancePath}`,
                async () => hashes.join("|"),
                () => getContentCounts(instancePath)
            );
        },
        enabled: !!instancePath,
        staleTime: Infinity
    });
}

export function useWorldsQuery(instancePath: string | undefined, page: number) {
    return useQuery<PaginatedResult<WorldInfo>>({
        queryKey: ["worlds", instancePath, page],
        queryFn: async () => {
            if (!instancePath) throw new Error("instancePath is required");
            const savesPath = await join(instancePath, "saves");
            return cachedFetch(
                `worlds:${instancePath}:${page}`,
                () => hashDir(savesPath),
                () => scanWorlds(instancePath, page)
            );
        },
        enabled: !!instancePath,
        staleTime: Infinity,
        placeholderData: keepPreviousData
    });
}

export function useContentQuery(instancePath: string | undefined, type: ContentType, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["content", instancePath, type, page],
        queryFn: async () => {
            if (!instancePath) throw new Error("instancePath is required");
            const contentPath = await join(instancePath, type);
            return cachedFetch(
                `content:${instancePath}:${type}:${page}`,
                () => hashDir(contentPath),
                () => scanContent(instancePath, type, page)
            );
        },
        enabled: !!instancePath,
        staleTime: Infinity,
        placeholderData: keepPreviousData
    });
}

export function useModsAndDatapacksQuery(instancePath: string | undefined, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["mods-datapacks", instancePath, page],
        queryFn: async () => {
            if (!instancePath) throw new Error("instancePath is required");
            const [modsPath, datapacksPath] = await Promise.all([join(instancePath, "mods"), join(instancePath, "datapacks")]);
            const [modsHash, datapacksHash] = await Promise.all([hashDir(modsPath), hashDir(datapacksPath)]);
            return cachedFetch(
                `mods-datapacks:${instancePath}:${page}`,
                async () => `${modsHash}|${datapacksHash}`,
                async () => {
                    const [m, d] = await Promise.all([scanContent(instancePath, "mods", page), scanContent(instancePath, "datapacks", page)]);
                    return { items: [...m.items, ...d.items], total: m.total + d.total, hasMore: m.hasMore || d.hasMore };
                }
            );
        },
        enabled: !!instancePath,
        staleTime: Infinity,
        placeholderData: keepPreviousData
    });
}

export function useDatapacksQuery(worldPath: string | null, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["datapacks", worldPath, page],
        queryFn: async () => {
            if (!worldPath) throw new Error("worldPath is required");
            const datapacksPath = await join(worldPath, "datapacks");
            return cachedFetch(
                `datapacks:${worldPath}:${page}`,
                () => hashDir(datapacksPath),
                () => scanDatapacks(worldPath, page)
            );
        },
        enabled: !!worldPath,
        staleTime: Infinity,
        placeholderData: keepPreviousData
    });
}
