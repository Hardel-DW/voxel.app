import { useRef } from "react";

interface UsePopoverPositionProps {
    triggerRef: React.RefObject<HTMLElement | null>;
    containerRef?: React.RefObject<HTMLElement | null>;
    spacing?: number;
}

export const usePopoverPosition = ({ triggerRef, containerRef, spacing = 8 }: UsePopoverPositionProps) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const resizeObserver = useRef<ResizeObserver | null>(null);

    const applyPosition = (node: HTMLDivElement) => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = node.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const topPosition = triggerRect.bottom + window.scrollY + spacing;
        const bottomPosition = triggerRect.top + window.scrollY - contentRect.height - spacing;
        const wouldOverflowBottom = triggerRect.bottom + contentRect.height + spacing > viewportHeight;
        const top = wouldOverflowBottom ? bottomPosition : topPosition;
        const containerRect = containerRef?.current?.getBoundingClientRect();
        const baseWidth = containerRect ? containerRect.width : undefined;
        const width = baseWidth && baseWidth < 160 ? undefined : baseWidth;
        const centeredLeft = triggerRect.left + window.scrollX - (contentRect.width - triggerRect.width) / 2;
        const minLeft = window.scrollX + spacing;
        const maxLeft = window.scrollX + window.innerWidth - contentRect.width - spacing;
        const left = containerRect ? containerRect.left + window.scrollX : Math.max(minLeft, Math.min(maxLeft, centeredLeft));

        node.style.top = `${top}px`;
        node.style.left = `${left}px`;
        if (width !== undefined) node.style.width = `${width}px`;
    };

    const refCallback = (node: HTMLDivElement | null) => {
        if (contentRef.current && !node) {
            resizeObserver.current?.disconnect();
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleResize);
        }

        contentRef.current = node;
        if (node) {
            applyPosition(node);
            resizeObserver.current = new ResizeObserver(() => {
                if (contentRef.current) applyPosition(contentRef.current);
            });
            resizeObserver.current.observe(node);
            window.addEventListener("resize", handleResize);
            window.addEventListener("scroll", handleResize);
        }
    };

    const handleResize = () => {
        if (contentRef.current) applyPosition(contentRef.current);
    };

    return refCallback;
};
