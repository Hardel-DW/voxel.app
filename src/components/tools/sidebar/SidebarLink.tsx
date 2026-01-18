import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SidebarLink(props: {
    to: string;
    params: { lang: string };
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
                props.disabled && "opacity-50 pointer-events-none"
            )}>
            <img src={props.icon} className="size-5 invert opacity-60" alt="Icon" />
            <span className="truncate text-sm font-medium flex-1">{props.children}</span>
            <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                {props.count}
            </span>
        </div>
    );

    if (props.disabled) return content;

    return (
        <Link to={props.to} params={props.params} onClick={props.onClick}>
            {content}
        </Link>
    );
}
