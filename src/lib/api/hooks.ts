import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadRepo } from "@/lib/api/download";
import { initializeRepository } from "@/lib/api/init";
import { createPullRequest, pushToGitHub } from "@/lib/api/push";
import { getAllRepos } from "@/lib/api/repos";
import { getSession, logout } from "@/lib/api/session";

export const useSession = () => useQuery({ queryKey: ["session"], queryFn: getSession, staleTime: 1000 * 60 * 5 });

export const useLogout = () => useMutation({ mutationFn: logout });

export const useAllRepos = () => useQuery({ queryKey: ["repos"], queryFn: getAllRepos });

export const useDownloadRepo = () =>
    useMutation({
        mutationFn: ({ owner, repo, branch }: { owner: string; repo: string; branch: string }) => downloadRepo(owner, repo, branch)
    });

export const useInitializeRepository = () =>
    useMutation({
        mutationFn: ({
            name,
            description,
            isPrivate,
            autoInit,
            files
        }: {
            name: string;
            description: string;
            isPrivate: boolean;
            autoInit: boolean;
            files?: Record<string, string | null>;
        }) => initializeRepository(name, description, isPrivate, autoInit, files)
    });

export const usePushToGitHub = () =>
    useMutation({
        mutationFn: ({
            owner,
            repo,
            branch,
            files
        }: {
            owner: string;
            repo: string;
            branch: string;
            files: Record<string, string | null>;
        }) => pushToGitHub(owner, repo, branch, files)
    });

export const useCreatePullRequest = () =>
    useMutation({
        mutationFn: ({
            owner,
            repo,
            branch,
            files,
            newBranch
        }: {
            owner: string;
            repo: string;
            branch: string;
            files: Record<string, string | null>;
            newBranch?: string;
        }) => createPullRequest(owner, repo, branch, files, newBranch)
    });
