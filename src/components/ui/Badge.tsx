import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Badge({ hue, children, className }: PropsWithChildren<{ hue: number; className?: string }>) {
    return (
        <span
            className={cn("text-[10px] font-bold uppercase tracking-widest mr-1 px-2 py-0.5 rounded-full border", className)}
            style={{
                color: `hsl(${hue}, 70%, 60%)`,
                backgroundColor: `hsl(${hue}, 70%, 50%, 0.1)`,
                borderColor: `hsl(${hue}, 70%, 50%, 0.2)`
            }}>
            {children}
        </span>
    );
}
