import { create } from "zustand";
import { persist } from "zustand/middleware";
import { removeCachedIcon } from "@/lib/utils/instance/icons";
import { safeExists } from "@/lib/utils/instance/helpers";
import type { ClientType } from "@/lib/utils/instance/types";

export type ProjectType = "datapacks" | "mods" | "resourcepacks" | "folder";

export interface RecentProject {
    name: string;
    path: string;
    icon?: string;
    lastOpened: number;
    type: ProjectType;
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
    projectExistsMap: Record<string, boolean>;
    addRecentProject: (project: Omit<RecentProject, "lastOpened">) => void;
    removeRecentProject: (path: string) => void;
    addGameClient: (client: GameClient) => void;
    removeGameClient: (path: string) => void;
    checkProjectsExistence: () => Promise<void>;
}

export const useHomeStore = create<HomeState>()(
    persist(
        (set, get) => ({
            recentProjects: [],
            gameClients: [],
            projectExistsMap: {},
            addRecentProject: (project) =>
                set((state) => ({
                    recentProjects: [
                        { ...project, lastOpened: Date.now() },
                        ...state.recentProjects.filter((p) => p.path !== project.path)
                    ].slice(0, 10),
                    projectExistsMap: { ...state.projectExistsMap, [project.path]: true }
                })),
            removeRecentProject: (path) => {
                removeCachedIcon(path).catch(() => {});
                return set((state) => {
                    const { [path]: _, ...restMap } = state.projectExistsMap;
                    return {
                        recentProjects: state.recentProjects.filter((p) => p.path !== path),
                        projectExistsMap: restMap
                    };
                });
            },
            addGameClient: (client) =>
                set((state) => ({ gameClients: [...state.gameClients.filter((c) => c.path !== client.path), client] })),
            removeGameClient: (path) => set((state) => ({ gameClients: state.gameClients.filter((c) => c.path !== path) })),
            checkProjectsExistence: async () => {
                const projects = get().recentProjects;
                const results = await Promise.all(projects.map(async (p) => [p.path, await safeExists(p.path)] as const));
                set({ projectExistsMap: Object.fromEntries(results) });
            }
        }),
        {
            name: "voxel-home-storage",
            partialize: (state) => ({ recentProjects: state.recentProjects, gameClients: state.gameClients }),
            onRehydrateStorage: () => (state) => state?.checkProjectsExistence()
        }
    )
);
