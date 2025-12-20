export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        ...options,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options?.headers }
    });

    if (!response.ok) {
        const errorMessage = await response
            .json()
            .then((data) => data?.error || response.statusText)
            .catch(() => response.statusText);
        throw new Error(errorMessage);
    }

    return response.status === 204 ? (undefined as T) : response.json();
}
