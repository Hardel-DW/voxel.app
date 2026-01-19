import { useNavigate, useParams } from "@tanstack/react-router";
import { useTauriFileDrop } from "@/lib/hook/useTauriFileDrop";
import { useTranslate } from "@/lib/i18n";
import { openDatapackFromPath } from "@/lib/store/ProjectStore";
import { cn } from "@/lib/utils";

export default function EmptyState() {
    const t = useTranslate();
    const navigate = useNavigate();
    const { lang } = useParams({ from: "/$lang" });
    const { isDragging } = useTauriFileDrop((paths) => {
        if (paths[0]) {
            openDatapackFromPath(paths[0], () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } }));
        }
    });

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-dashed transition-colors duration-200",
                "bg-zinc-900/30 border-zinc-800",
                isDragging && "bg-zinc-800/50 border-zinc-500"
            )}>
            <div className="size-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                <svg className="size-8 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <p className="text-sm text-zinc-400 text-center">{t("tauri:home.recent.empty")}</p>
            <p className="text-xs text-zinc-600 mt-1">{t("tauri:home.recent.empty.hint")}</p>
        </div>
    );
}
