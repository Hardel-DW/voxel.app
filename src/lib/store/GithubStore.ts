import { create } from "zustand";
import { updateSessionData } from "@/lib/utils/sessionPersistence";

interface GithubState {
    isGitRepository: boolean;
    owner: string;
    repositoryName: string;
    branch: string;
    token: string | null;
    isInitializing: number | null;
    setGitRepository: (owner: string, repositoryName: string, branch: string, token: string) => void;
    clearGitRepository: () => void;
    setInitializing: (isInitializing: number | null) => void;
}

export const useGithubStore = create<GithubState>((set) => ({
    isGitRepository: false,
    owner: "",
    repositoryName: "",
    branch: "",
    token: null,
    isInitializing: null,
    setGitRepository: (owner, repositoryName, branch, token) => {
        set({ isGitRepository: true, owner, repositoryName, branch, token });
        updateSessionData({ isGitRepository: true, owner, repositoryName, branch });
    },
    clearGitRepository: () => {
        set({ isGitRepository: false, owner: "", repositoryName: "", branch: "", token: null });
        updateSessionData({ isGitRepository: false, owner: "", repositoryName: "", branch: "" });
    },
    setInitializing: (isInitializing) => {
        set({ isInitializing });
        updateSessionData({ isInitializing });
    }
}));
