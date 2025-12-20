import { apiCall } from "./client";

export const handleGitHubCallback = (code: string, state: string) =>
    apiCall<{ success: boolean; returnTo: string; isNewTab: boolean }>("/callback/github", {
        method: "POST",
        body: JSON.stringify({ code, state })
    });
