import { apiCall } from "./client";
import type { AuthSession } from "./types";

export const getSession = () => apiCall<AuthSession>("/session", { method: "GET" });

export const logout = () => apiCall<{ success: boolean }>("/session/logout", { method: "POST" });
