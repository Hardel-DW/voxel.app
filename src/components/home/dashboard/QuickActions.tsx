import { useNavigate } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { hasSession, restoreSession } from "@/lib/utils/sessionPersistence";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

function QuickActionCard({ icon, label, description, onClick, disabled }: QuickActionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/40 hover:border-zinc-700/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left">
            <div className="size-12 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50 group-hover:border-zinc-600/50 transition-colors shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{label}</p>
                <p className="text-xs text-zinc-500 truncate">{description}</p>
            </div>
            <svg className="size-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

export default function QuickActions() {
    const navigate = useNavigate();
    const sessionExists = hasSession();

    const handleNewProject = () => {
        const mcmeta = { pack: { pack_format: 61, description: "New Voxel Project" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const elements = new Map();
        const logger = new Logger(files);

        useConfiguratorStore.getState().setup({ files, elements, version: 61, logger }, false, "New Project");
        navigate({ to: "/editor/enchantment/overview" });
    };

    const handleRestore = async () => {
        try {
            const session = restoreSession();
            if (!session) {
                toast(t("generic.error"), TOAST.ERROR, "No session found");
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

            toast(t("restore_session"), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Failed to restore session";
            toast(t("generic.error"), TOAST.ERROR, errorMessage);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickActionCard
                icon={
                    <svg className="size-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                }
                label={t("studio.new_project")}
                description={t("studio.new_project.description")}
                onClick={handleNewProject}
            />
            <QuickActionCard
                icon={
                    <svg className="size-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                    </svg>
                }
                label={t("restore_session")}
                description={t("restore_session.description")}
                onClick={handleRestore}
                disabled={!sessionExists}
            />
        </div>
    );
}
