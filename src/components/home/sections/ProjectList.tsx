import { useNavigate, useParams } from "@tanstack/react-router";
import ProjectCard from "@/components/home/sections/ProjectCard";
import { useTauriFileDrop } from "@/lib/hook/useTauriFileDrop";
import { useTranslate } from "@/lib/i18n";
import { useHomeStore } from "@/lib/store/HomeStore";
import { openDatapackFromPath } from "@/lib/store/ProjectStore";

export default function ProjectList() {
    const navigate = useNavigate();
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });
    const projects = useHomeStore((s) => s.recentProjects);
    const removeProject = useHomeStore((s) => s.removeRecentProject);

    useTauriFileDrop((paths) => {
        if (paths[0]) {
            openDatapackFromPath(paths[0], () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } }));
        }
    });

    return (
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
    );
}
