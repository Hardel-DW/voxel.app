import { useNavigate } from "@tanstack/react-router";
import { type RecentProject, useHomeStore } from "@/components/home/HomeStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { TOAST, toast } from "@/components/ui/Toast";
import { useTauriFileDrop } from "@/lib/hook/useTauriFileDrop";
import { loadDatapackFromPath } from "@/lib/utils/datapack";

function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("time.just_now");
    if (minutes < 60) return t("time.minutes_ago", { count: minutes });
    if (hours < 24) return t("time.hours_ago", { count: hours });
    if (days < 7) return t("time.days_ago", { count: days });
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(timestamp);
}

function ProjectCard(props: { project: RecentProject; onOpen: () => void; onRemove: () => void }) {
    return (
        <article className="group relative flex items-center gap-4 p-4 rounded-xl shadow-lg shadow-zinc-950/20 bg-zinc-950/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-all ease-in-out duration-200 backdrop-blur-sm">
            <button
                type="button"
                onClick={props.onOpen}
                className="absolute inset-0 z-0 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                aria-label={`Open ${props.project.name}`}
            />
            <div className="size-14 rounded-xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center overflow-hidden shrink-0">
                {props.project.icon ? (
                    <img src={"/images/addons/icon/yggdrasil.webp"} alt="" className="size-full object-cover" />
                ) : (
                    <img src="/images/addons/icon/yggdrasil.webp" alt="" className="size-full object-cover" />
                )}
            </div>
            <div className="flex-1 min-w-0 pointer-events-none">
                <p className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                    {props.project.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-md font-medium",
                        props.project.type === "mod"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    )}>
                        {props.project.type === "mod" ? "Mod" : "Datapack"}
                    </span>
                    <span className="text-xs text-zinc-500">{formatRelativeTime(props.project.lastOpened)}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={props.onRemove}
                className="relative z-10 opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-zinc-700/50 transition-all cursor-pointer">
                <svg className="size-4 text-zinc-500 hover:text-zinc-300" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </article>
    );
}

export default function RecentProjects() {
    const navigate = useNavigate();
    const projects = useHomeStore((s) => s.recentProjects);
    const removeProject = useHomeStore((s) => s.removeRecentProject);
    const { isDragging } = useTauriFileDrop(async (paths: string[]) => paths[0] && openDatapack(paths[0]));

    const openDatapack = async (path: string, callback?: () => void) => {
        try {
            const { datapack, name, isModded } = await loadDatapackFromPath(path);
            useConfiguratorStore.getState().setup(datapack, isModded, name);
            useHomeStore.getState().addRecentProject({ name, path, type: isModded ? "mod" : "datapack" });
            toast(t("studio.success.loaded", { file: name }), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("studio.error.failed_to_upload");
            toast(t("generic.dialog.error"), TOAST.ERROR, errorMessage);
            callback?.();
        }
    };

    return (
        <section className="space-y-4 relative z-50 px-8">
            {projects.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-zinc-200">{t("home.recent.title")}</h2>
                            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">
                                {projects.length}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projects.slice(0, 4).map((project) => (
                            <ProjectCard
                                key={`${project.id}-${project.name}`}
                                project={project}
                                onOpen={() => openDatapack(project.path, () => removeProject(project.id))}
                                onRemove={() => removeProject(project.id)}
                            />
                        ))}
                    </div>
                </>
            ) : (
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
                    <p className="text-sm text-zinc-400 text-center">{t("home.recent.empty")}</p>
                    <p className="text-xs text-zinc-600 mt-1">{t("home.recent.empty.hint")}</p>
                </div>
            )}
        </section>
    );
}
