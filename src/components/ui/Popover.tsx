import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useId, useRef } from "react";
import { create } from "zustand";
import Portal from "@/components/ui/Portal";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { cn } from "@/lib/utils";

interface PopoverState {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export const usePopoverStore = create<PopoverState>((set) => ({
    activeId: null,
    setActiveId: (id) => set({ activeId: id })
}));

const PopoverContext = createContext<{ id: string; triggerRef: React.RefObject<HTMLElement | null> } | null>(null);

export function Popover(props: { children: ReactNode; className?: string }) {
    const id = useId();
    const triggerRef = useRef<HTMLElement>(null);

    return (
        <PopoverContext.Provider value={{ id, triggerRef }}>
            <div className={cn("relative inline-block", props.className)}>{props.children}</div>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    className?: string;
}) {
    const context = useContext(PopoverContext);
    if (!context) throw new Error("PopoverTrigger must be used within a Popover");

    const { activeId, setActiveId } = usePopoverStore();
    const isActive = activeId === context.id;

    return (
        <Trigger elementRef={context.triggerRef} onToggle={() => setActiveId(isActive ? null : context.id)} className={props.className}>
            {props.children}
        </Trigger>
    );
}

export function PopoverContent(props: { children: ReactNode; className?: string; spacing?: number }) {
    const { children, className, spacing } = props;
    const context = useContext(PopoverContext);
    if (!context) throw new Error("PopoverContent must be used within a Popover");
    const { activeId, setActiveId } = usePopoverStore();
    const isOpen = activeId === context.id;
    const positionRef = usePopoverPosition({ triggerRef: context.triggerRef, spacing });
    const clickOutsideRef = useClickOutside(() => {
        if (isOpen) setActiveId(null);
    });

    if (!isOpen) return null;

    return (
        <Portal>
            <div
                ref={(node) => {
                    positionRef(node);
                    if (clickOutsideRef) clickOutsideRef.current = node;
                }}
                style={{ margin: 0, inset: "unset" }}
                className={cn(
                    "rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-200 shadow-md outline-hidden z-9999",
                    className
                )}>
                {children}
            </div>
        </Portal>
    );
}
