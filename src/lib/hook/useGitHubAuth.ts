import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initiateGitHubAuth } from "@/lib/api/auth";
import { getAllRepos } from "@/lib/api/repos";
import { getSession, logout } from "@/lib/api/session";

const AUTH_QUERY_KEY = ["github", "auth"] as const;
const REPOS_QUERY_KEY = ["github", "repos"] as const;

export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
}

export interface AuthState {
    token: string;
    user: GitHubUser;
}

export function useGitHubAuth() {
    const queryClient = useQueryClient();
    const authQuery = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getSession,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
        retry: false,
        enabled: typeof document !== "undefined" && document.cookie.includes("has-session=")
    });

    const loginMutation = useMutation({
        mutationFn: async (options?: { redirect?: boolean }) => {
            const returnTo = window.location.pathname;
            const redirect = options?.redirect ?? true;

            if (!redirect) {
                const channel = new BroadcastChannel("github-auth");
                channel.onmessage = (event) => {
                    if (event.data.type === "auth-success") {
                        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
                        channel.close();
                    }
                };
            }

            const result = await initiateGitHubAuth(returnTo, !redirect);
            if (redirect) {
                window.location.href = result.authUrl;
            }
        }
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REPOS_QUERY_KEY });
        }
    });

    const isAuthenticated = authQuery.data?.authenticated;

    return {
        isAuthenticated: !!isAuthenticated,
        user: isAuthenticated && authQuery.data?.authenticated ? authQuery.data.user : null,
        token: isAuthenticated && authQuery.data?.authenticated ? authQuery.data.token : null,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate
    };
}

export function useGitHubRepos(token: string | null) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: [REPOS_QUERY_KEY, token],
        queryFn: getAllRepos,
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message.includes("Unauthorized")) {
                queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
                return false;
            }
            return failureCount < 3;
        }
    });
}
