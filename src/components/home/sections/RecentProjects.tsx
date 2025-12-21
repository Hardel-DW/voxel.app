import { useNavigate } from "@tanstack/react-router";
import { useHomeStore } from "@/components/home/HomeStore";
import ProjectCard from "@/components/home/sections/ProjectCard";
import { useConfiguratorStore } from "@/components/tools/Store";
import { TOAST, toast } from "@/components/ui/Toast";
import { useTauriFileDrop } from "@/lib/hook/useTauriFileDrop";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { loadDatapackFromPath } from "@/lib/utils/datapack";

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
                            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{projects.length}</span>
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
