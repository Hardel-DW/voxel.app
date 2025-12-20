import { apiCall } from "./client";

export const initiateGitHubAuth = (returnTo?: string, isNewTab?: boolean) =>
    apiCall<{ authUrl: string }>("/auth/initiate", {
        method: "POST",
        body: JSON.stringify({ returnTo, isNewTab })
    });
