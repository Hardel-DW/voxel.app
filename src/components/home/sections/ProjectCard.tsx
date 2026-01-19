import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { formatRelativeTime } from "@/lib/getGreeting";
import { useTranslate } from "@/lib/i18n";
import { type RecentProject, useHomeStore } from "@/lib/store/HomeStore";
import { cn } from "@/lib/utils";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";

interface ProjectCardProps {
    project: RecentProject;
    onOpen: () => void;
    onRemove: () => void;
}

export default function ProjectCard({ project, onOpen, onRemove }: ProjectCardProps) {
    const t = useTranslate();
    const exists = useHomeStore((s) => s.projectExistsMap[project.path] ?? true);
    const iconSrc = convertIconToSrc(project.icon ?? null);

    return (
        <article
            className={cn(
                "group relative flex items-center gap-4 p-4 rounded-xl shadow-lg shadow-zinc-950/20 border transition-all ease-in-out duration-200 backdrop-blur-sm",
                exists ? "bg-zinc-950/30 border-zinc-800/50 hover:border-zinc-700/50" : "bg-red-950/20 border-red-900/30 opacity-60"
            )}>
            {exists ? (
                <button
                    type="button"
                    onClick={onOpen}
                    className="absolute inset-0 z-0 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                    aria-label={`Open ${project.name}`}
                />
            ) : (
                <div className="absolute inset-0 z-0 rounded-xl cursor-not-allowed" />
            )}
            <div
                className={cn(
                    "size-14 rounded-xl border flex items-center justify-center overflow-hidden shrink-0",
                    exists ? "bg-zinc-900 border-zinc-800/50" : "bg-red-950/30 border-red-900/30"
                )}>
                <img src={iconSrc} alt="Project icon" className={cn("size-full object-cover", !exists && "grayscale opacity-50")} />
            </div>
            <div className="flex-1 min-w-0 pointer-events-none">
                <div className="flex flex-col">
                    <p
                        className={cn(
                            "font-medium transition-colors truncate",
                            exists ? "text-zinc-200 group-hover:text-white" : "text-red-400/70"
                        )}>
                        {project.name}
                    </p>
                    <span className="text-[9px] text-zinc-600 truncate max-w-9/10" title={project.path}>
                        {project.path}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    {exists ? (
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    "text-xs px-2 py-0.5 rounded-md font-medium",
                                    project.type === "mods"
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                )}>
                                {project.type === "mods" ? "Mod" : "Datapack"}
                            </span>
                            <span
                                className={cn(
                                    "text-xs px-2 py-0.5 rounded-md font-medium",
                                    project.type === "folder"
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                )}>
                                {project.type === "folder" ? "Folder" : project.type === "mods" ? "Jar" : "Zipped"}
                            </span>
                            <span className="text-xs text-zinc-500">{formatRelativeTime(project.lastOpened)}</span>
                        </div>
                    ) : (
                        <span className="text-xs text-red-400/70">{t("tauri:home.recent.not_found")}</span>
                    )}
                </div>
            </div>
            <div className={cn("relative z-10 flex items-center gap-1", exists ? "opacity-0 group-hover:opacity-100" : "opacity-100")}>
                <button
                    type="button"
                    onClick={() => revealItemInDir(project.path)}
                    className="p-2 rounded-lg hover:bg-zinc-700/50 transition-all cursor-pointer group/icon"
                    aria-label="Open in file explorer">
                    <img src="/icons/folder.svg" alt="Open in file explorer" className="size-4 invert-25 group-hover/icon:invert-70" />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className={cn(
                        "p-2 rounded-lg transition-all cursor-pointer group/icon",
                        exists ? "hover:bg-zinc-700/50" : "hover:bg-red-900/30"
                    )}>
                    <img src="/icons/close.svg" alt="Remove" className="size-4 invert-25 group-hover/icon:invert-70" />
                </button>
            </div>
        </article>
    );
}
