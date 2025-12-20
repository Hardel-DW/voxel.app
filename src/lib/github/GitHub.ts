import { extractZip } from "@voxelio/zip";
import { initiateGitHubAuth } from "@/lib/api/auth";
import { downloadRepo } from "@/lib/api/download";
import { initializeRepository as initRepo } from "@/lib/api/init";
import { createPullRequest, pushToGitHub } from "@/lib/api/push";
import { getAllRepos } from "@/lib/api/repos";
import { calculateContentSize, formatBytes } from "../utils/encode";
import { GitHubError, GithubRepoValidationError } from "./GitHubError";

type TreeItem = {
    path: string;
    mode?: string;
    type?: string;
    sha: string | null;
};

export type Repository = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    owner: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
    clone_url: string;
    updated_at: string;
    default_branch: string;
};

export type Organization = {
    login: string;
    id: number;
    avatar_url: string;
    description: string;
};

export type ReposResponse = {
    repositories: Repository[];
    organizations: Organization[];
    orgRepositories: Repository[];
};

type GitHubOptions = {
    token?: string | null;
};

const MAX_FILES = 1000;
const MAX_TOTAL_SIZE = 1_048_576; // 1 MB
const MAX_FILE_SIZE = 204_800; // 200 KB

export class GitHub {
    private token: string | null;

    constructor({ token = null }: GitHubOptions = {}) {
        this.token = token;
    }

    private get authenticatedToken(): string {
        if (!this.token) {
            throw new GitHubError("Missing authorization token", 401);
        }
        return this.token;
    }

    private buildHeaders(options?: { requireAuth?: boolean; contentType?: boolean }): Record<string, string> {
        const { requireAuth = true, contentType = false } = options || {};

        const headers: Record<string, string> = {
            Accept: "application/vnd.github+json",
            "User-Agent": "Voxel-Studio"
        };

        if (requireAuth) {
            headers.Authorization = `Bearer ${this.authenticatedToken}`;
        }

        if (contentType) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    }

    private async request<T>(method: "GET" | "POST" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
        const headers = this.buildHeaders({ contentType: body !== undefined });

        const response = await fetch(`https://api.github.com${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new GitHubError(`GitHub API error: ${response.statusText}`, response.status);
        }

        return response.json();
    }

    getUser() {
        return this.request<{ login: string; id: number; avatar_url: string }>("GET", "/user");
    }

    getUserRepos() {
        return this.request<Repository[]>("GET", "/user/repos?per_page=100&sort=updated");
    }

    getUserOrgs() {
        return this.request<Organization[]>("GET", "/user/orgs");
    }

    getOrgRepos(org: string) {
        return this.request<Repository[]>("GET", `/orgs/${org}/repos?per_page=100&sort=updated`);
    }

    getRef(owner: string, repo: string, branch: string) {
        return this.request<{ ref: string; object: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
    }

    getCommit(owner: string, repo: string, sha: string) {
        return this.request<{ sha: string; tree: { sha: string } }>("GET", `/repos/${owner}/${repo}/git/commits/${sha}`);
    }

    createBlob(owner: string, repo: string, content: string) {
        const encoding = "base64";
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/blobs`, { content, encoding });
    }

    createTree(owner: string, repo: string, baseTreeSha: string | undefined, tree: TreeItem[]) {
        const body: { tree: TreeItem[]; base_tree?: string } = { tree };
        if (baseTreeSha) body.base_tree = baseTreeSha;
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/trees`, body);
    }

    createCommit(owner: string, repo: string, message: string, treeSha: string, parentSha?: string) {
        const parents = parentSha ? [parentSha] : [];
        const tree = treeSha;
        return this.request<{ sha: string }>("POST", `/repos/${owner}/${repo}/git/commits`, { message, tree, parents });
    }

    updateRef(owner: string, repo: string, branch: string, sha: string) {
        return this.request<{ ref: string; object: { sha: string } }>("PATCH", `/repos/${owner}/${repo}/git/refs/heads/${branch}`, { sha });
    }

    createRef(owner: string, repo: string, branch: string, sha: string) {
        const ref = `refs/heads/${branch}`;
        return this.request<{ ref: string; object: { sha: string } }>("POST", `/repos/${owner}/${repo}/git/refs`, { ref, sha });
    }

    createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
        return this.request<{ html_url: string; number: number }>("POST", `/repos/${owner}/${repo}/pulls`, { title, head, base, body });
    }

    createRepository(name: string, description: string, isPrivate: boolean, autoInit: boolean) {
        return this.request<{ name: string; full_name: string; html_url: string; default_branch: string }>("POST", "/user/repos", {
            name,
            description,
            private: isPrivate,
            auto_init: autoInit
        });
    }

    async downloadRepo(owner: string, repo: string, branch: string) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
            headers: this.buildHeaders()
        });

        if (!response.ok) {
            throw new GitHubError("Failed to download repository", response.status);
        }

        return response;
    }

    async getAccessToken(clientId: string, clientSecret: string, code: string) {
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: this.buildHeaders({ requireAuth: false, contentType: true }),
            body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
        });

        if (!response.ok) {
            throw new GitHubError(`GitHub returned ${response.status}`, response.status);
        }

        const data = (await response.json()) as { access_token?: string; error?: string; error_description?: string };

        if (data.error) {
            throw new GitHubError(data.error_description || "Failed to get access token", 400);
        }

        return data;
    }

    async getAllRepos(): Promise<ReposResponse> {
        return getAllRepos();
    }

    private async createTreeFromFiles(owner: string, repo: string, files: Record<string, string | null>) {
        return Promise.all(
            Object.entries(files).map(async ([path, content]) => {
                if (content === null) return { path, sha: null };
                const blobData = await this.createBlob(owner, repo, content);
                return { path, mode: "100644", type: "blob", sha: blobData.sha };
            })
        );
    }

    private buildCommitMessage(filesCount: number, isInitial: boolean) {
        const action = isInitial ? `Initial commit with` : `Update`;
        return `${action} ${filesCount} file${filesCount > 1 ? "s" : ""} ${isInitial ? "from" : "via"} Voxel Studio\n\nCo-authored-by: Voxel Studio <studio.voxelio@gmail.com>`;
    }

    async prepareCommit(owner: string, repo: string, baseSha: string, files: Record<string, string | null>) {
        const commitData = await this.getCommit(owner, repo, baseSha);
        const tree = await this.createTreeFromFiles(owner, repo, files);
        const treeData = await this.createTree(owner, repo, commitData.tree.sha, tree);
        const filesCount = Object.keys(files).length;
        const body = this.buildCommitMessage(filesCount, false);
        return { treeData, body, filesCount };
    }

    async prepareInitialCommit(owner: string, repo: string, files: Record<string, string | null>) {
        const tree = await this.createTreeFromFiles(owner, repo, files);
        const treeData = await this.createTree(owner, repo, undefined, tree);
        const filesCount = Object.keys(files).length;
        const body = this.buildCommitMessage(filesCount, true);
        return { treeData, body, filesCount };
    }

    async send(
        owner: string,
        repositoryName: string,
        branch: string,
        action?: "pr" | "push",
        files?: Record<string, string | null>,
        newBranch?: string
    ) {
        if (!action) throw new GitHubError("Missing action parameter", 400);
        if (!files) throw new GitHubError("Missing files parameter", 400);

        if (import.meta.env.VITE_DISABLE_GITHUB_ACTIONS) return { filesModified: Object.keys(files).length, prUrl: undefined };
        return action === "push"
            ? pushToGitHub(owner, repositoryName, branch, files)
            : createPullRequest(owner, repositoryName, branch, files, newBranch);
    }

    async clone(owner: string, repositoryName: string, branch: string, removeRootFolder: boolean) {
        const response = await downloadRepo(owner, repositoryName, branch);
        const zipData = new Uint8Array(await response.arrayBuffer());
        const extractedFiles = await extractZip(zipData);

        if (!removeRootFolder) {
            return extractedFiles;
        }

        const firstPath = Object.keys(extractedFiles)[0];
        const rootPrefix = firstPath.includes("/") ? `${firstPath.split("/")[0]}/` : "";
        return Object.fromEntries(
            Object.entries(extractedFiles)
                .filter(([path]) => path.startsWith(rootPrefix))
                .map(([path, data]) => [path.substring(rootPrefix.length), data])
        );
    }

    async initiateAuth(returnTo?: string, redirect = true) {
        const result = await initiateGitHubAuth(returnTo, !redirect);

        if (redirect) {
            window.location.href = result.authUrl;
        } else {
            window.open(result.authUrl, "_blank");
        }

        return result;
    }

    async initializeRepository(
        name: string,
        description: string,
        isPrivate: boolean,
        autoInit: boolean,
        files: Record<string, string | null>
    ) {
        return initRepo(name, description, isPrivate, autoInit, files);
    }

    static validateRepository(files: Record<string, string | null>): void {
        const fileEntries = Object.entries(files);
        if (fileEntries.length > MAX_FILES) {
            throw new GithubRepoValidationError(`Limit exceeded: ${fileEntries.length} files (max ${MAX_FILES})`);
        }

        const totalSize = fileEntries.reduce((total, [fileName, content]) => {
            const fileSize = calculateContentSize(content);
            if (fileSize > MAX_FILE_SIZE) {
                throw new GithubRepoValidationError(
                    `File too large: ${fileName} (${formatBytes(fileSize)}, max ${formatBytes(MAX_FILE_SIZE)})`
                );
            }

            return total + fileSize;
        }, 0);

        if (totalSize > MAX_TOTAL_SIZE) {
            throw new GithubRepoValidationError(`Total size too large: ${formatBytes(totalSize)} (max ${formatBytes(MAX_TOTAL_SIZE)})`);
        }
    }
}
