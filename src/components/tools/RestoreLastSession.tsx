import { useNavigate } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { hasSession, restoreSession } from "@/lib/utils/sessionPersistence";
import { TOAST, toast } from "../ui/Toast";

export default function RestoreLastSession({ className }: { className?: string }) {
    const navigate = useNavigate();
    if (!hasSession()) return null;

    const handleRestore = async () => {
        try {
            const session = restoreSession();
            if (!session) {
                toast("No session found", TOAST.ERROR);
                return;
            }

            const datapack = new Datapack(session.files);
            const result = datapack.parse();
            const restoredElements = session.logger.applyChangeSets(session.logger.getChangeSets(), result.elements);
            useConfiguratorStore
                .getState()
                .setup({ ...result, logger: session.logger, elements: restoredElements }, session.isModded, session.name);

            useExportStore.getState().clearGitRepository();
            if (session.isGitRepository) {
                useExportStore.getState().setGitRepository(session.owner, session.repositoryName, session.branch, "");
            }

            useExportStore.getState().setInitializing(session.isInitializing);

            toast("Session restored successfully", TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Failed to restore session";
            toast("Error", TOAST.ERROR, errorMessage);
        }
    };

    return (
        <Button variant="shimmer" onClick={handleRestore} className={className}>
            {t("restore_session")}
        </Button>
    );
}
