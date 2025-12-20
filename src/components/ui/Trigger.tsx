import type { ReactElement } from "react";
import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface TriggerProps<T extends HTMLElement> {
    children: ReactElement<{ ref?: React.Ref<T>; onClick?: (e: React.MouseEvent) => void; className?: string }>;
    className?: string;
    elementRef?: React.RefObject<T | null>;
    onToggle?: () => void;
}

export function Trigger<T extends HTMLElement>({ children, className, elementRef, onToggle }: TriggerProps<T>) {
    if (!isValidElement(children)) {
        throw new Error("Trigger children must be a valid React element");
    }

    return cloneElement(children, {
        ref: elementRef,
        onClick: (e: React.MouseEvent) => {
            children.props.onClick?.(e);
            onToggle?.();
        },
        className: cn(children.props.className, className)
    });
}
