import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientType } from "@/lib/utils/instance";

export interface RecentProject {
    name: string;
    path: string;
    icon?: string;
    lastOpened: number;
    type: "datapacks" | "mods" | "resourcepacks";
}

export interface GameClient {
    name: string;
    type: ClientType;
    path: string;
    icon?: string;
}

interface HomeState {
    recentProjects: RecentProject[];
    gameClients: GameClient[];
    addRecentProject: (project: Omit<RecentProject, "lastOpened">) => void;
    removeRecentProject: (path: string) => void;
    addGameClient: (client: GameClient) => void;
    removeGameClient: (path: string) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set) => ({
            recentProjects: [],
            gameClients: [],
            addRecentProject: (project) =>
                set((state) => {
                    const filtered = state.recentProjects.filter((p) => p.path !== project.path);
                    return { recentProjects: [{ ...project, lastOpened: Date.now() }, ...filtered].slice(0, 10) };
                }),
            removeRecentProject: (path) => set((state) => ({ recentProjects: state.recentProjects.filter((p) => p.path !== path) })),
            addGameClient: (client) =>
                set((state) => {
                    if (state.gameClients.some((c) => c.path === client.path)) return state;
                    return { gameClients: [...state.gameClients, client] };
                }),
            removeGameClient: (path) => set((state) => ({ gameClients: state.gameClients.filter((c) => c.path !== path) }))
        }),
        { name: "voxel-home-storage" }
    )
);
