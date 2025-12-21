import { Button } from "@/components/ui/Button";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { t } from "@/lib/i18n";

export default function UnauthView() {
    const { login } = useGitHubAuth();
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-zinc-400">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Non connecté</p>
                    <p className="text-xs text-zinc-500">Connectez-vous pour accéder aux fonctionnalités GitHub</p>
                </div>
            </div>
            <Button
                onClick={() => login({ redirect: false })}
                className="w-full flex items-center gap-x-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white">
                <img src="/icons/company/github.svg" alt="GitHub" className="size-4 invert" />
                <span className="text-xs font-medium text-zinc-200">{t("repository.login_to_github")}</span>
            </Button>
        </div>
    );
}
