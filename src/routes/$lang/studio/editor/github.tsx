import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import LineBackground from "@/components/ui/line/LineBackground";
import { TOAST, toast } from "@/components/ui/Toast";
import { GitHub } from "@/lib/github/GitHub";
import { GithubRepoValidationError } from "@/lib/github/GitHubError";
import { useTranslate } from "@/lib/i18n";
import { useGithubStore } from "@/lib/store/GithubStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { encodeToBase64 } from "@/lib/utils/encode";
import { sanitizeRepoName } from "@/lib/utils/text";

const DESCRIPTION = "Minecraft datapack created with Voxel Studio";
export const Route = createFileRoute("/$lang/studio/editor/github")({
    component: GithubInitPage
});

function GithubInitPage() {
    const t = useTranslate();
    const { token, isInitializing } = useGithubStore();
    const name = useConfiguratorStore((state) => state.name);
    const [repoName, setRepoName] = useState("");

    const initMutation = useMutation({
        mutationFn: () => {
            const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
            const files = Object.fromEntries(Object.entries(compiledFiles).map(([path, content]) => [path, encodeToBase64(content)]));
            useGithubStore.getState().setInitializing(Object.keys(files).length);
            return new GitHub({ token }).initializeRepository(repoName, DESCRIPTION, false, true, files);
        },
        onSuccess: (data) => {
            toast(t("github:init.success"), TOAST.SUCCESS);
            const [newOwner, newRepoName] = data.fullName.split("/");
            useGithubStore.setState({ owner: newOwner, repositoryName: newRepoName, branch: data.defaultBranch, isGitRepository: true });
        },
        onError: (error: Error) => {
            if (error instanceof GithubRepoValidationError) {
                return toast(t("github:init.error.validation"), TOAST.ERROR);
            }
            toast(t("github:init.error"), TOAST.ERROR, error.message);
        },
        onSettled: () => useGithubStore.getState().setInitializing(null)
    });

    return (
        <div className="flex size-full overflow-hidden relative isolate bg-sidebar">
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <div className="absolute z-5 inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="absolute z-5 w-full h-full inset-0">
                    <LineBackground frequency={2000} />
                </div>
                <div className="z-5 absolute inset-0 scale-110">
                    <svg
                        className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
                        style={{ transform: "skewY(-12deg)" }}>
                        <defs>
                            <pattern id="grid-github" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                                <path d="M64 0H0V64" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-github)" />
                    </svg>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center space-y-2">
                            <div className="size-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-xl mb-6">
                                <img src="/icons/company/github.svg" className="size-8 invert opacity-80" alt="GitHub" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">{t("github:init.title")}</h1>
                            <p className="text-zinc-400">{t("github:init.description")}</p>
                        </div>
                        <div className="space-y-4 bg-sidebar p-6 rounded-2xl border border-zinc-800/50 relative">
                            <div className="space-y-2">
                                <label htmlFor="repoName" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                                    {t("github:init.label")}
                                </label>
                                <input
                                    type="text"
                                    id="repoName"
                                    value={repoName}
                                    onChange={(e) => setRepoName(sanitizeRepoName(e.target.value))}
                                    placeholder={name.toLowerCase().replace(/[^a-z0-9-_]/g, "-")}
                                    className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 placeholder:text-zinc-600 focus:outline-hidden focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all font-mono text-sm"
                                />
                            </div>
                            {isInitializing && (
                                <div className="absolute inset-0 flex items-center flex-col justify-center bg-zinc-950/50 rounded-2xl z-10 backdrop-blur-sm">
                                    <div className="size-8 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
                                    <span className="text-sm text-zinc-400 mt-4">
                                        {t("github:init.progress.sidebar", { count: isInitializing })}
                                    </span>
                                </div>
                            )}
                            <Button
                                onClick={() => initMutation.mutate()}
                                disabled={initMutation.isPending || !repoName}
                                className="w-full h-12 bg-white text-black font-bold hover:bg-zinc-200 rounded-xl transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed">
                                {t("github:init.confirm")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
