export type AuthSession =
    | { authenticated: true; user: { login: string; id: number; avatar_url: string }; token: string }
    | { authenticated: false };

export type Repository = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    owner: { login: string; avatar_url: string };
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
