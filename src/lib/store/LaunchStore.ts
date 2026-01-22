import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

export interface LaunchState {
    launchPath: string | null;
    isLaunchedByMinecraft: boolean;
    initialize: () => Promise<void>;
}

export const useLaunchStore = create<LaunchState>((set) => ({
    launchPath: null,
    isLaunchedByMinecraft: false,
    initialize: async () => {
        const launchPath = await invoke<string | null>("get_launch_path");
        set({
            launchPath,
            isLaunchedByMinecraft: launchPath !== null
        });
    }
}));
