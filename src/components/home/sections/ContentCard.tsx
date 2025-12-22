import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ContentCardProps {
    title: string;
    iconSrc?: string;
    subtitle?: string;
    type: string;
    path?: string;
    expanded?: boolean;
    expandable?: boolean;
    showActions?: boolean;
    onExpand?: () => void;
    onConfigure?: () => void;
}

export function ContentCard(props: ContentCardProps) {
    const { title, iconSrc, subtitle, type, path, expanded, expandable, showActions = true, onExpand, onConfigure } = props;

    const handleOpenFolder = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (path) await revealItemInDir(path);
    };

    return (
        <div
            className={cn(
                "group relative flex items-center gap-4 p-3 rounded-2xl backdrop-blur-md bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-800 hover:bg-zinc-900/90 transition-all duration-300",
                expandable && "cursor-pointer"
            )}
            onClick={expandable ? onExpand : undefined}
        >
            <div className="size-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                {iconSrc ? (
                    <img
                        src={iconSrc}
                        alt={title}
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="size-full flex items-center justify-center bg-zinc-800">
                        <svg className="size-6 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{title}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    {subtitle && <span className="truncate">{subtitle}</span>}
                    {subtitle && <span className="text-zinc-600">•</span>}
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">{type}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {expandable && (
                    <div className="p-2 text-zinc-500">
                        <svg
                            className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}

                {onConfigure && (
                    <Button
                        variant="ghost"
                        className="border-zinc-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfigure();
                        }}
                    >
                        Configure
                    </Button>
                )}

                {showActions && path && (
                    <button
                        type="button"
                        onClick={handleOpenFolder}
                        className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        title="Open in explorer"
                    >
                        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
