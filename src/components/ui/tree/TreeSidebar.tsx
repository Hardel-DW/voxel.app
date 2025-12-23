import { Link } from "@tanstack/react-router";
import { FileTree } from "@/components/ui/tree/FileTree";
import { useTree } from "@/components/ui/tree/useTree";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";

export function TreeSidebar() {
    const { tree, modifiedCount, changesRoute, isAllActive, selectAll, clearSelection } = useTree();

    return (
        <div className="space-y-1 mt-4">
            <SidebarLink
                to={changesRoute}
                icon="/icons/pencil.svg"
                count={modifiedCount}
                disabled={modifiedCount === 0}
                onClick={clearSelection}>
                Updated
            </SidebarLink>
            <SidebarButton icon="/icons/search.svg" count={tree.count} isActive={isAllActive} onClick={selectAll}>
                All
            </SidebarButton>
            <FileTree />
        </div>
    );
}

function SidebarButton({
    icon,
    count,
    isActive,
    onClick,
    children
}: {
    icon: string;
    count: number;
    isActive?: boolean;
    onClick: () => void;
    children: string;
}) {
    const hue = stringToColor(children.toLowerCase());

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            )}>
            {isActive && (
                <div
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ backgroundColor: hueToHsl(hue) }}
                />
            )}
            <img src={icon} className="size-5 invert opacity-60" alt="" />
            <span className="truncate text-sm font-medium flex-1">{children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {count}
            </span>
        </button>
    );
}

function SidebarLink({
    to,
    icon,
    count,
    disabled,
    onClick,
    children
}: {
    to: string;
    icon: string;
    count: number;
    disabled?: boolean;
    onClick?: () => void;
    children: string;
}) {
    const content = (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                disabled && "opacity-50 pointer-events-none"
            )}>
            <img src={icon} className="size-5 invert opacity-60" alt="" />
            <span className="truncate text-sm font-medium flex-1">{children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {count}
            </span>
        </div>
    );

    if (disabled) return content;

    return (
        <Link to={to} onClick={onClick}>
            {content}
        </Link>
    );
}
