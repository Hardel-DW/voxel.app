import { defaultShouldDehydrateQuery, isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Number.POSITIVE_INFINITY,
                gcTime: 1000 * 60 * 60 * 24
            },
            dehydrate: {
                shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending"
            }
        }
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (isServer) return makeQueryClient();
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
}
