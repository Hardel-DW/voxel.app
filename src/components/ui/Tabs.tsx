import React, { createContext, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
    updateIndicator: (button: HTMLButtonElement) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    indicatorRef: React.RefObject<HTMLDivElement | null>;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
    defaultValue: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

export function Tabs({ defaultValue, onValueChange, className, children }: TabsProps) {
    const [value, setValue] = useState(defaultValue);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateIndicator = (button: HTMLButtonElement) => {
        if (indicatorRef.current && containerRef.current) {
            const rect = button.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            indicatorRef.current.style.width = `${rect.width}px`;
            indicatorRef.current.style.transform = `translateX(${rect.left - containerRect.left}px)`;
        }
    };

    const handleValueChange = (newValue: string) => {
        setValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange, updateIndicator, containerRef, indicatorRef }}>
            <div className={className}>
                <div
                    ref={containerRef}
                    className="h-fit relative w-full justify-center text-sm rounded-2xl border border-zinc-800 p-1 text-zinc-400 flex bg-transparent overflow-hidden">
                    <div className="absolute inset-0 -z-10 hue-rotate-45 brightness-20">
                        <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                    </div>
                    {React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === TabsTrigger)}
                    <div
                        ref={indicatorRef}
                        className="absolute left-0 top-1 rounded-xl bg-white/10 z-0 transition-all duration-300 ease-out"
                        style={{
                            height: "calc(100% - 8px)"
                        }}
                    />
                </div>
                {React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === TabsContent)}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsTrigger(props: { value: string; children: React.ReactNode; className?: string; disabled?: boolean }) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = props.value === context.value;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        context.onValueChange(props.value);
        context.updateIndicator(button);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={props.disabled}
            ref={(node) => {
                if (isActive && node) {
                    requestAnimationFrame(() => context.updateIndicator(node));
                }
            }}
            className={cn(
                "text-zinc-500 flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-all cursor-pointer hover:text-white",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground/80",
                props.disabled && "pointer-events-none opacity-50",
                props.className
            )}>
            {props.children}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (value !== context.value) return null;

    return <div className={className}>{children}</div>;
}
