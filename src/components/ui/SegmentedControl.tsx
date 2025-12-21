import { createContext, type ReactNode, use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SegmentedContextValue {
    value: string;
    onChange: (value: string) => void;
    registerRef: (value: string, element: HTMLButtonElement | null) => void;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

interface SegmentedControlProps {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
    className?: string;
}

interface SegmentedItemProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function SegmentedControl({ value, onChange, children, className }: SegmentedControlProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [indicator, setIndicator] = useState({ width: 0, x: 0 });

    useEffect(() => {
        const container = containerRef.current;
        const element = itemRefs.current.get(value);
        if (!element || !container) return;
        const update = () => {
            const containerRect = container.getBoundingClientRect();
            const itemRect = element.getBoundingClientRect();
            setIndicator({ width: itemRect.width, x: itemRect.left - containerRect.left });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        return () => observer.disconnect();
    }, [value]);

    const registerRef = (itemValue: string, element: HTMLButtonElement | null) => {
        if (element) {
            itemRefs.current.set(itemValue, element);
        } else {
            itemRefs.current.delete(itemValue);
        }
    };

    return (
        <SegmentedContext value={{ value, onChange, registerRef }}>
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
        </SegmentedContext>
    );
}

export function SegmentedItem({ value, children, className }: SegmentedItemProps) {
    const ctx = use(SegmentedContext);
    if (!ctx) throw new Error("SegmentedItem must be used within SegmentedControl");

    const isActive = ctx.value === value;

    return (
        <button
            type="button"
            ref={(el) => ctx.registerRef(value, el)}
            onClick={() => ctx.onChange(value)}
            className={cn(
                "relative z-10 px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer",
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200",
                className
            )}>
            {children}
        </button>
    );
}
