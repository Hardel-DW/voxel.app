import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getContentCounts, scanContent, scanDatapacks } from "@/lib/utils/instance/content";
import { scanLauncherInstances } from "@/lib/utils/instance/launchers";
import type {
    ClientType,
    ContentCounts,
    ContentType,
    InstanceInfo,
    PackContent,
    PaginatedResult,
    WorldInfo
} from "@/lib/utils/instance/types";
import { scanWorlds } from "@/lib/utils/instance/worlds";

export function useInstancesQuery(path: string | undefined, type: ClientType) {
    return useQuery<(InstanceInfo | WorldInfo)[]>({
        queryKey: ["instances", path, type],
        queryFn: () => {
            if (!path) return [];
            return type === "vanilla" ? scanWorlds(path).then((r) => r.items) : scanLauncherInstances(type, path);
        },
        enabled: !!path,
        staleTime: 30_000
    });
}

export function useContentCountsQuery(instancePath: string | undefined) {
    return useQuery<ContentCounts>({
        queryKey: ["content-counts", instancePath],
        queryFn: () => {
            if (!instancePath) return Promise.reject(new Error("instancePath is required"));
            return getContentCounts(instancePath);
        },
        enabled: !!instancePath,
        staleTime: 30_000
    });
}

export function useWorldsQuery(instancePath: string | undefined, page: number) {
    return useQuery<PaginatedResult<WorldInfo>>({
        queryKey: ["worlds", instancePath, page],
        queryFn: () => {
            if (!instancePath) return Promise.reject(new Error("instancePath is required"));
            return scanWorlds(instancePath);
        },
        enabled: !!instancePath,
        staleTime: 30_000,
        placeholderData: keepPreviousData
    });
}

export function useContentQuery(instancePath: string | undefined, type: ContentType, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["content", instancePath, type, page],
        queryFn: () => {
            if (!instancePath) return Promise.reject(new Error("instancePath is required"));
            return scanContent(instancePath, type, page);
        },
        enabled: !!instancePath,
        staleTime: 30_000,
        placeholderData: keepPreviousData
    });
}

export function useModsAndDatapacksQuery(instancePath: string | undefined, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["mods-datapacks", instancePath, page],
        queryFn: async () => {
            if (!instancePath) return Promise.reject(new Error("instancePath is required"));
            const [m, d] = await Promise.all([scanContent(instancePath, "mods", page), scanContent(instancePath, "datapacks", page)]);
            return { items: [...m.items, ...d.items], total: m.total + d.total, hasMore: m.hasMore || d.hasMore };
        },
        enabled: !!instancePath,
        staleTime: 30_000,
        placeholderData: keepPreviousData
    });
}

export function useDatapacksQuery(worldPath: string | null, page: number) {
    return useQuery<PaginatedResult<PackContent>>({
        queryKey: ["datapacks", worldPath, page],
        queryFn: () => {
            if (!worldPath) return Promise.reject(new Error("worldPath is required"));
            return scanDatapacks(worldPath);
        },
        enabled: !!worldPath,
        staleTime: 30_000,
        placeholderData: keepPreviousData
    });
}
