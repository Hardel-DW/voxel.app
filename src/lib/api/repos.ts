import { apiCall } from "./client";
import type { ReposResponse } from "./types";

export const getAllRepos = () => apiCall<ReposResponse>("/repos/all", { method: "GET" });
