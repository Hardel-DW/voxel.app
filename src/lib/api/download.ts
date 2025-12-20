export const downloadRepo = (owner: string, repo: string, branch: string) =>
    fetch(`/api/download?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`, {
        method: "GET",
        credentials: "include"
    }).then((r) => {
        if (!r.ok) throw new Error("Failed to download repository");
        return r;
    });
