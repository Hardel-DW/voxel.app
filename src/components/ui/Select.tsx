import type { ReactElement, ReactNode } from "react";
import React from "react";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import Portal from "@/components/ui/Portal";
import { Trigger } from "@/components/ui/Trigger";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { usePopoverPosition } from "@/lib/hook/usePopoverPosition";
import { cn } from "@/lib/utils";

interface SelectContextState<T> {
    value: T | undefined;
    onChange: (value: T) => void;
    registerOption: (value: T, text: ReactNode) => void;
    getDisplayText: (value: T) => ReactNode;
}

const SelectContext = createDisclosureContext<HTMLButtonElement>();
const ValueContext = React.createContext<SelectContextState<any> | null>(null);

export function Select<T>(props: { children: ReactNode; className?: string; value: T; setValue: (value: T) => void }) {
    const displayTextMap = React.useRef(new Map<T, ReactNode>());
    const registerOption = (value: T, text: ReactNode) => displayTextMap.current.set(value, text);
    const getDisplayText = (value: T) => displayTextMap.current.get(value);
    const handleChange = (newValue: T) => props.setValue?.(newValue);

    return (
        <SelectContext.Provider>
            <ValueContext.Provider
                value={{
                    value: props.value,
                    onChange: handleChange,
                    registerOption,
                    getDisplayText
                }}>
                <div className={cn("relative inline-block", props.className)}>{props.children}</div>
            </ValueContext.Provider>
        </SelectContext.Provider>
    );
}

export function SelectTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: (e: React.MouseEvent) => void; className?: string }>;
    className?: string;
}) {
    const { setOpen, triggerRef } = SelectContext.useDisclosure();

    const triggerContent = (
        <div className="flex items-center justify-between w-full">
            {props.children}
            <img src="/icons/chevron-down.svg" alt="chevron-down" className="invert h-4 w-4 opacity-50" />
        </div>
    );

    return (
        <Trigger
            elementRef={triggerRef}
            onToggle={() => setOpen((prev) => !prev)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm ring-offset-zinc-700 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                props.className
            )}>
            {triggerContent}
        </Trigger>
    );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(ValueContext);
    if (!context) throw new Error("SelectValue must be used within Select");

    const displayText = context.value !== undefined ? context.getDisplayText(context.value) : null;
    return <span className="block truncate">{displayText || placeholder}</span>;
}

export function SelectContent({ children, className }: { children: ReactNode; className?: string }) {
    const { open, setOpen, triggerRef } = SelectContext.useDisclosure();
    const positionRef = usePopoverPosition({ triggerRef });
    const clickOutsideRef = useClickOutside(() => setOpen(false));

    if (!open) return null;

    return (
        <Portal>
            <div
                ref={(node) => {
                    positionRef(node);
                    if (clickOutsideRef) clickOutsideRef.current = node;
                    if (node && typeof node.showPopover === "function") {
                        node.showPopover();
                        if (triggerRef.current) node.style.width = `${triggerRef.current.offsetWidth}px`;
                    }
                }}
                popover="auto"
                style={{ position: "absolute", margin: 0, inset: "unset" }}
                className={cn(
                    "max-h-75 min-w-32 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-950 text-zinc-400 shadow-md outline-hidden duration-150 ease-bounce",
                    className
                )}>
                <div className="p-1">{children}</div>
            </div>
        </Portal>
    );
}

export function SelectItem<T>({ value, children, className }: { value: T; children: ReactNode; className?: string }) {
    const context = React.useContext(ValueContext);
    const { setOpen } = SelectContext.useDisclosure();
    if (!context) throw new Error("SelectItem must be used within Select");
    const isSelected = context.value === value;
    context.registerOption(value, children);

    return (
        <button
            type="button"
            onClick={() => {
                context.onChange(value);
                setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-xs py-1.5 pl-8 pr-2 text-sm text-left outline-hidden hover:bg-zinc-900 hover:text-zinc-200 data-disabled:pointer-events-none data-disabled:opacity-50",
                className
            )}>
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <img src="/icons/checked.svg" alt="check" className="size-6 invert" />}
            </span>
            {children}
        </button>
    );
}

export function SelectGroup({ children }: { children: ReactNode }) {
    return <div className="space-y-1">{children}</div>;
}

export function SelectLabel({ children }: { children: ReactNode }) {
    return <div className="py-1.5 pl-8 pr-2 text-sm font-semibold">{children}</div>;
}

export function SelectSeparator() {
    return <div className="h-px bg-zinc-700" />;
}
