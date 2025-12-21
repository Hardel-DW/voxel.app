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
}

export interface GameInstance {
    id: string;
    name: string;
    clientId: string;
    path: string;
    iconPath: string | null;
    lastModified: number;
}

interface HomeState {
    recentProjects: RecentProject[];
    gameClients: GameClient[];
    gameInstances: GameInstance[];
    expandedClientId: string | null;

    addRecentProject: (project: Omit<RecentProject, "id" | "lastOpened">) => void;
    removeRecentProject: (id: string) => void;
    clearRecentProjects: () => void;

    addGameClient: (client: Omit<GameClient, "id">) => void;
    removeGameClient: (id: string) => void;
    setExpandedClient: (id: string | null) => void;

    setClientInstances: (clientId: string, instances: Omit<GameInstance, "id" | "clientId">[]) => void;
    getInstancesByClient: (clientId: string) => GameInstance[];
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set, get) => ({
            recentProjects: [],
            gameClients: [],
            gameInstances: [],
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
                    gameClients: state.gameClients.filter((c) => c.id !== id),
                    gameInstances: state.gameInstances.filter((i) => i.clientId !== id)
                })),

            setExpandedClient: (id) => set({ expandedClientId: id }),

            setClientInstances: (clientId, instances) =>
                set((state) => {
                    const filtered = state.gameInstances.filter((i) => i.clientId !== clientId);
                    const newInstances = instances.map((inst) => ({
                        ...inst,
                        id: crypto.randomUUID(),
                        clientId
                    }));
                    return { gameInstances: [...filtered, ...newInstances] };
                }),

            getInstancesByClient: (clientId) => {
                return get().gameInstances.filter((i) => i.clientId === clientId);
            }
        }),
        {
            name: "voxel-home-storage"
        }
    )
);
