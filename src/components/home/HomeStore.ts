import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ClientType = "vanilla" | "modrinth" | "curseforge" | "custom";

export interface RecentProject {
    id: string;
    name: string;
    path: string;
    icon?: string;
    lastOpened: number;
    type: "datapack" | "mod";
    version?: string;
}

export interface GameClient {
    id: string;
    name: string;
    type: ClientType;
    path: string;
    icon?: string;
    instanceCount?: number;
}

export interface WorldInstance {
    id: string;
    name: string;
    clientId: string;
    path: string;
    icon?: string;
    lastPlayed?: number;
    version?: string;
}

interface HomeState {
    recentProjects: RecentProject[];
    gameClients: GameClient[];
    expandedClientId: string | null;

    addRecentProject: (project: Omit<RecentProject, "id" | "lastOpened">) => void;
    removeRecentProject: (id: string) => void;
    clearRecentProjects: () => void;

    addGameClient: (client: Omit<GameClient, "id">) => void;
    removeGameClient: (id: string) => void;
    setExpandedClient: (id: string | null) => void;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set) => ({
            recentProjects: [],
            gameClients: [
                {
                    id: "vanilla-default",
                    name: "Vanilla Minecraft",
                    type: "vanilla",
                    path: "%appdata%/.minecraft",
                    instanceCount: 0
                }
            ],
            expandedClientId: null,

            addRecentProject: (project) =>
                set((state) => {
                    const id = crypto.randomUUID();
                    const existing = state.recentProjects.find((p) => p.path === project.path);
                    if (existing) {
                        return {
                            recentProjects: state.recentProjects.map((p) =>
                                p.path === project.path ? { ...p, lastOpened: Date.now() } : p
                            )
                        };
                    }
                    return {
                        recentProjects: [{ ...project, id, lastOpened: Date.now() }, ...state.recentProjects].slice(0, 10)
                    };
                }),

            removeRecentProject: (id) =>
                set((state) => ({
                    recentProjects: state.recentProjects.filter((p) => p.id !== id)
                })),

            clearRecentProjects: () => set({ recentProjects: [] }),

            addGameClient: (client) =>
                set((state) => ({
                    gameClients: [...state.gameClients, { ...client, id: crypto.randomUUID() }]
                })),

            removeGameClient: (id) =>
                set((state) => ({
                    gameClients: state.gameClients.filter((c) => c.id !== id)
                })),

            setExpandedClient: (id) => set({ expandedClientId: id })
        }),
        {
            name: "voxel-home-storage"
        }
    )
);
