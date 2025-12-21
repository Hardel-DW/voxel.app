import type { RecentProject } from "@/components/home/HomeStore";
import { formatRelativeTime } from "@/lib/getGreeting";
import { cn } from "@/lib/utils";

export default function ProjectCard(props: { project: RecentProject; onOpen: () => void; onRemove: () => void }) {
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
                <p className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">{props.project.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span
                        className={cn(
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
