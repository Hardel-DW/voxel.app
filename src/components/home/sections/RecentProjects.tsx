import { useNavigate } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { type RecentProject, useHomeStore } from "@/components/home/HomeStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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

interface ProjectCardProps {
    project: RecentProject;
    onOpen: () => void;
    onRemove: () => void;
}

function ProjectCard({ project, onOpen, onRemove }: ProjectCardProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="group relative flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all text-left w-full cursor-pointer">
            <div className="size-14 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center overflow-hidden shrink-0">
                {project.icon ? (
                    <img src={project.icon} alt="" className="size-full object-cover" />
                ) : (
                    <img src="/icons/package.svg" alt="" className="size-7 opacity-40 invert" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                    {project.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-md font-medium",
                        project.type === "mod"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    )}>
                        {project.type === "mod" ? "Mod" : "Datapack"}
                    </span>
                    <span className="text-xs text-zinc-500">{formatRelativeTime(project.lastOpened)}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-zinc-700/50 transition-all">
                <svg className="size-4 text-zinc-500 hover:text-zinc-300" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
        </button>
    );
}

export default function RecentProjects() {
    const navigate = useNavigate();
    const projects = useHomeStore((s) => s.recentProjects);
    const removeProject = useHomeStore((s) => s.removeRecentProject);

    const handleOpenProject = async (project: RecentProject) => {
        try {
            const response = await fetch(project.path);
            const blob = await response.blob();
            const file = new File([blob], project.name, { type: blob.type });
            const datapack = await Datapack.from(file);
            const result = datapack.parse();
            useConfiguratorStore.getState().setup(result, project.type === "mod", project.name);
            navigate({ to: "/editor/enchantment/overview" });
        } catch {
            removeProject(project.id);
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-zinc-200">{t("home.recent.title")}</h2>
                    {projects.length > 0 && (
                        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">
                            {projects.length}
                        </span>
                    )}
                </div>
                {projects.length > 0 && (
                    <button
                        type="button"
                        onClick={() => useHomeStore.getState().clearRecentProjects()}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        {t("home.recent.clear")}
                    </button>
                )}
            </div>
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projects.slice(0, 4).map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onOpen={() => handleOpenProject(project)}
                            onRemove={() => removeProject(project.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 rounded-xl border border-dashed border-zinc-800/50">
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
