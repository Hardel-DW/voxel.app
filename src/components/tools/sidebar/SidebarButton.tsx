import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";

export function SidebarButton(props: { icon: string; count: number; isActive?: boolean; onClick: () => void; children: string }) {
    const hue = stringToColor(props.children.toLowerCase());

    return (
        <button
            type="button"
            onClick={props.onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors relative group w-full text-left",
                props.isActive ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            )}>
            {props.isActive && (
                <div
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ backgroundColor: hueToHsl(hue) }}
                />
            )}
            <img src={props.icon} className="size-5 invert opacity-60" alt="Icon" />
            <span className="truncate text-sm font-medium flex-1">{props.children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {props.count}
            </span>
        </button>
    );
}
