import { createContext, type ReactNode, use } from "react";
import { cn } from "@/lib/utils";

type ToggleContextValue = { value: string; onChange: (value: string) => void };
const ToggleContext = createContext<ToggleContextValue | null>(null);

interface ToggleGroupProps {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
    className?: string;
}

interface ToggleGroupOptionProps {
    value: string;
    icon?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export function ToggleGroup({ value, onChange, children, className }: ToggleGroupProps) {
    return (
        <ToggleContext value={{ value, onChange }}>
            <div className={cn("flex items-center bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50", className)}>{children}</div>
        </ToggleContext>
    );
}

export function ToggleGroupOption({ value, icon, children, className }: ToggleGroupOptionProps) {
    const ctx = use(ToggleContext);
    if (!ctx) throw new Error("ToggleGroupOption must be used within ToggleGroup");
    const isActive = ctx.value === value;
    const isIconOnly = icon && !children;

    return (
        <button
            type="button"
            data-state={isActive ? "on" : "off"}
            onClick={() => ctx.onChange(value)}
            className={cn(
                "rounded-md transition-all cursor-pointer text-zinc-500 hover:text-zinc-300 relative isolate",
                isIconOnly ? "p-2" : "flex-1 text-[10px] uppercase font-bold py-1.5 px-2",
                isActive && "bg-zinc-900 text-zinc-100 shadow-sm hover:text-zinc-100",
                className
            )}>
            {isActive && (
                <div className="absolute inset-0 -z-10 brightness-20">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>
            )}
            {children ?? icon}
        </button>
    );
}
