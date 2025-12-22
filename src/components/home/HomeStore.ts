import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientType } from "@/lib/utils/instance";
import { removeCachedIcon } from "@/lib/utils/instance";

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
            addRecentProject: (project) => set((state) => ({ recentProjects: [{ ...project, lastOpened: Date.now() }, ...state.recentProjects.filter((p) => p.path !== project.path)].slice(0, 10) })),
            removeRecentProject: (path) => {
                removeCachedIcon(path).catch(() => {});
                return set((state) => ({ recentProjects: state.recentProjects.filter((p) => p.path !== path) }));
            },
            addGameClient: (client) => set((state) => ({ gameClients: [...state.gameClients.filter((c) => c.path !== client.path), client] })),
            removeGameClient: (path) => set((state) => ({ gameClients: state.gameClients.filter((c) => c.path !== path) }))
        }),
        { name: "voxel-home-storage" }
    )
);
