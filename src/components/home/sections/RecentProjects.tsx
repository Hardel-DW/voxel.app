import { useNavigate, useParams } from "@tanstack/react-router";
import ProjectCard from "@/components/home/sections/ProjectCard";
import { useTauriFileDrop } from "@/lib/hook/useTauriFileDrop";
import { useTranslate } from "@/lib/i18n";
import { useHomeStore } from "@/lib/store/HomeStore";
import { openDatapackFromPath } from "@/lib/store/ProjectStore";
import { cn } from "@/lib/utils";

export default function RecentProjects() {
    const navigate = useNavigate();
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const projects = useHomeStore((s) => s.recentProjects);
    const removeProject = useHomeStore((s) => s.removeRecentProject);
    const { isDragging } = useTauriFileDrop(
        async (paths: string[]) =>
            paths[0] &&
            openDatapackFromPath(paths[0], () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } }))
    );

    return (
        <section className="space-y-4 relative z-50 px-8">
            {projects.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-zinc-200">{t("tauri:home.recent.title")}</h2>
                            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{projects.length}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projects.slice(0, 4).map((project) => (
                            <ProjectCard
                                key={project.path}
                                project={project}
                                onOpen={() =>
                                    openDatapackFromPath(project.path, () =>
                                        navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } })
                                    )
                                }
                                onRemove={() => removeProject(project.path)}
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
                    <p className="text-sm text-zinc-400 text-center">{t("tauri:home.recent.empty")}</p>
                    <p className="text-xs text-zinc-600 mt-1">{t("tauri:home.recent.empty.hint")}</p>
                </div>
            )}
        </section>
    );
}
