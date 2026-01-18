import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { Button } from "@/components/ui/Button";
import { TOAST, toast } from "@/components/ui/Toast";
import { useTranslate } from "@/lib/i18n";
import { useGithubStore } from "@/lib/store/GithubStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { hasSession, restoreSession } from "@/lib/utils/sessionPersistence";

export default function RestoreLastSession({ className }: { className?: string }) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();
    if (!hasSession()) return null;

    const handleRestore = async () => {
        try {
            const session = restoreSession();
            if (!session) {
                toast(t("session.not_found"), TOAST.ERROR);
                return;
            }

            const datapack = new Datapack(session.files);
            const result = datapack.parse();
            const restoredElements = session.logger.applyChangeSets(session.logger.getChangeSets(), result.elements);
            useConfiguratorStore
                .getState()
                .setup({ ...result, logger: session.logger, elements: restoredElements }, session.isModded, session.name);

            useGithubStore.getState().clearGitRepository();
            if (session.isGitRepository) {
                useGithubStore.getState().setGitRepository(session.owner, session.repositoryName, session.branch, "");
            }

            useGithubStore.getState().setInitializing(session.isInitializing);

            toast(t("session.restored"), TOAST.SUCCESS);
            navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("session.restore_failed");
            toast(t("error"), TOAST.ERROR, errorMessage);
        }
    };

    return (
        <Button variant="shimmer" onClick={handleRestore} className={className}>
            {t("restore_session")}
        </Button>
    );
}
