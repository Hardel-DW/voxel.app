import { createContext, type ReactNode, use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
    value: string;
    onChange: (value: string) => void;
    registerRef: (value: string, el: HTMLButtonElement | null) => void;
    refs: Map<string, HTMLButtonElement>;
}

const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
    const ctx = use(TabsContext);
    if (!ctx) throw new Error("Component must be used within Tabs");
    return ctx;
};

export function Tabs({
    value,
    onChange,
    children,
    className
}: {
    value: string;
    onChange: (v: string) => void;
    children: ReactNode;
    className?: string;
}) {
    const refs = useRef(new Map<string, HTMLButtonElement>()).current;
    const registerRef = (v: string, el: HTMLButtonElement | null) => (el ? refs.set(v, el) : refs.delete(v));

    return (
        <TabsContext value={{ value, onChange, registerRef, refs }}>
            <div className={className}>{children}</div>
        </TabsContext>
    );
}

export function TabList({ children, className }: { children: ReactNode; className?: string }) {
    const { value, refs } = useTabs();
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicator, setIndicator] = useState({ width: 0, x: 0 });

    useEffect(() => {
        const container = containerRef.current;
        const el = refs.get(value);
        if (!container || !el) return;

        const update = () => {
            const cRect = container.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();
            setIndicator({ width: eRect.width, x: eRect.left - cRect.left });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        return () => observer.disconnect();
    }, [value, refs]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative inline-flex items-center gap-1 p-1 rounded-full backdrop-blur-md bg-zinc-950/50 border border-zinc-800/80",
                className
            )}>
            <div
                className="absolute inset-1 rounded-full bg-white/10 transition-all duration-300 ease-out"
                style={{ width: indicator.width, transform: `translateX(${indicator.x - 4}px)` }}
            />
            {children}
        </div>
    );
}

export function Tab({
    value,
    children,
    className,
    disabled
}: {
    value: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}) {
    const ctx = useTabs();

    return (
        <button
            type="button"
            ref={(el) => ctx.registerRef(value, el)}
            onClick={() => !disabled && ctx.onChange(value)}
            disabled={disabled}
            className={cn(
                "relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer",
                ctx.value === value ? "text-white" : "text-zinc-400 hover:text-zinc-200",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}>
            {children}
        </button>
    );
}

export function TabPanel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
    const ctx = useTabs();
    if (ctx.value !== value) return null;
    return <div className={className}>{children}</div>;
}
