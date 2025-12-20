import { apiCall } from "./client";

export type PushResponse = {
    filesModified: number;
    prUrl: string | null | undefined;
};

export const pushToGitHub = (owner: string, repo: string, branch: string, files: Record<string, string | null>) =>
    apiCall<PushResponse>("/push", {
        method: "POST",
        body: JSON.stringify({ owner, repo, branch, files })
    });

export const createPullRequest = (owner: string, repo: string, branch: string, files: Record<string, string | null>, newBranch?: string) =>
    apiCall<PushResponse>("/push/pr", {
        method: "POST",
        body: JSON.stringify({ owner, repo, branch, files, newBranch })
    });
