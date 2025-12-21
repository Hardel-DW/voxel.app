import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { t } from "@/lib/i18n";

export default function RepositoryLoading() {
    const { isInitializing } = useExportStore();
    if (!isInitializing) return null;

    return (
        <div className="absolute inset-0 flex items-center flex-col justify-center bg-zinc-950/50 rounded-2xl w-full h-full z-100 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin" />
            <span className="text-sm text-zinc-400 mt-4">{t("github.init.progress.sidebar", { count: isInitializing })}</span>
        </div>
    );
}
