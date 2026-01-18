import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { disableIcon?: boolean }) {
    const { disableIcon, ...rest } = props;
    return (
        <div className={cn("relative", rest.className)}>
            {!disableIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
            )}
            <input
                {...rest}
                type="text"
                className={cn(
                    "w-full pl-8 pr-4 py-2 bg-zinc-800/30 border border-zinc-800 rounded-full text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:bg-zinc-700/20 transition-all",
                    disableIcon && "pl-4",
                    rest.className
                )}
            />
        </div>
    );
}
