import { useEffect, useEffectEvent, useState } from "react";

interface Position {
    top: number;
    left: number;
}

interface UseBoxPositionProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    contentRef: React.RefObject<HTMLElement | null>;
    open: boolean;
}

export const useBoxPosition = ({ triggerRef, contentRef, open }: UseBoxPositionProps) => {
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

    const updatePosition = useEffectEvent(() => {
        if (!triggerRef.current || !contentRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const growRight = triggerRect.left + contentRect.width <= viewportWidth - 8;
        const growDown = triggerRect.top + contentRect.height <= viewportHeight - 8;

        let left: number;
        if (growRight) {
            left = triggerRect.left + window.scrollX;
        } else {
            left = triggerRect.right + window.scrollX - contentRect.width;
            left = Math.max(8, left);
        }

        let top: number;
        if (growDown) {
            top = triggerRect.top + window.scrollY;
        } else {
            top = triggerRect.bottom + window.scrollY - contentRect.height;
            top = Math.max(8, top);
        }

        setPosition({ top, left });
    });

    useEffect(() => {
        if (!open) return;
        const frame = requestAnimationFrame(updatePosition);

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
        };
    }, [open]);

    return position;
};
