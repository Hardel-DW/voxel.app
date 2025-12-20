import type { Organization, Repository, ReposResponse } from "@/lib/github/GitHub";
import type { GitHubUser } from "@/lib/hook/useGitHubAuth";

export type Account = {
    value: string;
    label: string;
    type: "user" | "organization";
    description?: string;
};

export class RepositoryManager {
    private user: GitHubUser | null;
    private data: ReposResponse | undefined;

    constructor(user: GitHubUser | null, data: ReposResponse | undefined) {
        this.user = user;
        this.data = data;
    }

    private buildPersonalAccount(): Account | null {
        if (!this.user) return null;

        return {
            value: this.user.login,
            label: this.user.login,
            type: "user"
        };
    }

    private buildOrganizationAccount(org: Organization): Account {
        return {
            value: org.login,
            label: org.login,
            type: "organization",
            description: org.description
        };
    }

    getAccounts(): Account[] {
        if (!this.user || !this.data) return [];

        const personal = this.buildPersonalAccount();
        const organizations = this.data.organizations.map((org) => this.buildOrganizationAccount(org));

        return personal ? [personal, ...organizations] : organizations;
    }

    getAllRepositories(): Repository[] {
        return this.data ? [...this.data.repositories, ...this.data.orgRepositories] : [];
    }

    filterByAccount(repositories: Repository[], accountLogin: string): Repository[] {
        return repositories.filter((repo) => repo.owner.login === accountLogin);
    }

    filterBySearch(repositories: Repository[], query: string): Repository[] {
        return repositories.filter((repo) => repo.name.toLowerCase().includes(query.toLowerCase()));
    }

    getFilteredRepositories(selectedAccount: string, searchQuery: string): Repository[] {
        const byAccount = this.filterByAccount(this.getAllRepositories(), selectedAccount);
        return this.filterBySearch(byAccount, searchQuery);
    }

    findAccount(accountValue: string): Account | undefined {
        return this.getAccounts().find((acc) => acc.value === accountValue);
    }

    getDefaultAccountLogin(): string {
        return this.getAllRepositories()[0]?.owner.login || this.user?.login || "";
    }
}
