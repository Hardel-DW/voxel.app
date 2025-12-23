export type ClientType = "vanilla" | "modrinth" | "curseforge" | "custom";
export type ContentType = "mods" | "datapacks" | "resourcepacks";

export interface LauncherPreset {
    id: ClientType;
    name: string;
    icon: string;
    getDefaultPath: () => Promise<string>;
}

export interface InstanceInfo {
    name: string;
    path: string;
    iconPath: string | null;
    iconUrl: string | null;
    versionId: number | null;
}

export interface WorldInfo {
    name: string;
    path: string;
    iconPath: string | null;
    versionId: number | null;
}

export interface PackContent {
    name: string;
    path: string;
    type: ContentType;
    iconPath: string | null;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    hasMore: boolean;
}

export interface ContentCounts {
    worlds: number;
    mods: number;
    datapacks: number;
    resourcepacks: number;
}

export interface InstanceKey {
    path: string;
    type: ClientType;
}
