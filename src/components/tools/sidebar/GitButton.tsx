import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { useTranslate } from "@/lib/i18n";
import { useGithubStore } from "../../../lib/store/GithubStore";

export default function GitButton() {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const { isAuthenticated, login } = useGitHubAuth();
    const { isGitRepository } = useGithubStore();

    if (isGitRepository) {
        return (
            <Button
                type="button"
                variant="transparent"
                size="square"
                className="border-0 select-none aspect-square shrink-0"
                to="/$lang/studio/editor/changes/main"
                params={{ lang }}>
                <img src="/icons/company/github.svg" alt="Git" className="size-6 invert opacity-70" />
            </Button>
        );
    }

    if (isAuthenticated) {
        return (
            <Button
                type="button"
                variant="transparent"
                size="square"
                className="border-0 select-none aspect-square shrink-0"
                to="/$lang/studio/editor/github"
                params={{ lang }}>
                <img src="/icons/company/github.svg" alt="Git" className="size-6 invert opacity-70" />
            </Button>
        );
    }

    return (
        <Dialog id="git-dialog">
            <DialogTrigger>
                <Button type="button" variant="transparent" size="square" className="border-0 select-none aspect-square shrink-0">
                    <img src="/icons/company/github.svg" alt="Git" className="size-6 invert opacity-70" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0 overflow-hidden gap-0">
                <div className="flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/shine.avif')] opacity-10 bg-cover bg-center pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="size-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl shadow-black/50">
                            <img src="/icons/company/github.svg" alt="GitHub" className="size-10 invert" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-2xl font-bold text-white tracking-tight">{t("github:unlock.cloud.sync.title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{t("github:unlock.cloud.sync.description")}</p>
                        </div>
                        <Button
                            onClick={() => login({ redirect: false })}
                            className="h-12 px-8 bg-white text-black font-bold hover:bg-zinc-200 transition-all rounded-full shadow-lg shadow-white/5">
                            {t("github:unlock.cloud.sync.button")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
