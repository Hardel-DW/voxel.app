import { apiCall } from "./client";

export type InitRepositoryResponse = {
    name: string;
    fullName: string;
    htmlUrl: string;
    defaultBranch: string;
};

export const initializeRepository = (
    name: string,
    description: string,
    isPrivate: boolean,
    autoInit: boolean,
    files?: Record<string, string | null>
) =>
    apiCall<InitRepositoryResponse>("/init", {
        method: "POST",
        body: JSON.stringify({ name, description, isPrivate, autoInit, files })
    });
