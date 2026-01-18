import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type ViewMode = "diff" | "voxel" | "patch" | "edit";

interface DiffHeaderProps {
    name: string;
    file: string;
    lang: string;
    currentView: ViewMode;
}

const viewRoutes = {
    diff: "/$lang/studio/editor/changes/diff",
    voxel: "/$lang/studio/editor/changes/voxel",
    patch: "/$lang/studio/editor/changes/patch",
    edit: "/$lang/studio/editor/changes/edit"
} as const;

export function DiffHeader({ name, file, lang, currentView }: DiffHeaderProps) {
    const views: ViewMode[] = ["diff", "voxel", "patch", "edit"];

    return (
        <div className="flex items-center justify-between gap-1 px-4 py-2 border-b border-zinc-800/50 bg-zinc-950/20">
            <div className="relative flex h-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-red-500" />
                        <div className="size-3 rounded-full bg-yellow-500" />
                        <div className="size-3 rounded-full bg-green-500" />
                    </div>
                    <span className="font-mono text-sm text-zinc-300">{name}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-600 font-mono">{file}</span>
                <div className="flex items-center gap-2">
                    {views.map((mode) => (
                        <Link
                            key={mode}
                            to={viewRoutes[mode]}
                            params={{ lang }}
                            search={{ file }}
                            className={cn(
                                "p-1.5 cursor-pointer rounded transition-colors text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                                currentView === mode && "bg-zinc-800 text-zinc-100"
                            )}>
                            <img src={`/icons/tools/diff/${mode}.svg`} className="size-4" alt={mode} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
