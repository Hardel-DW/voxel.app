import { type ReactNode, useRef, useState } from "react";
import Portal from "@/components/ui/Portal";
import { clsx } from "@/lib/utils";
import { useFloatingBarPortal } from "./FloatingBarContext";

interface ToolbarProps {
    children: ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
    const { portalRef, containerCenter, state } = useFloatingBarPortal();
    const [position, setPosition] = useState<{ centerX: number; edgeY: number; anchorBottom: boolean } | null>(null);
    const [showSnapZone, setShowSnapZone] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);

    const center = containerCenter ?? window.innerWidth / 2;

    const getDefaultCenter = () => ({
        x: center,
        y: window.innerHeight - 80
    });

    const isNearDefaultPosition = (centerX: number, centerY: number) => {
        const defaultCenter = getDefaultCenter();
        const distance = Math.sqrt((centerX - defaultCenter.x) ** 2 + (centerY - defaultCenter.y) ** 2);
        return distance < 100;
    };

    const startDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        const rect = toolbar.getBoundingClientRect();
        const toolbarCenterX = rect.left + rect.width / 2;
        const toolbarCenterY = rect.top + rect.height / 2;
        const offsetX = e.clientX - toolbarCenterX;
        const offsetY = e.clientY - toolbarCenterY;

        const halfHeight = rect.height / 2;
        const computePosition = (clientX: number, clientY: number) => {
            const padding = 50;
            const centerX = Math.max(padding, Math.min(clientX - offsetX, window.innerWidth - padding));
            const centerY = Math.max(padding, Math.min(clientY - offsetY, window.innerHeight - padding));
            const anchorBottom = centerY > window.innerHeight / 2;
            const edgeY = anchorBottom ? window.innerHeight - (centerY + halfHeight) : centerY - halfHeight;
            return { centerX, centerY, edgeY, anchorBottom };
        };

        const handleMouseMove = (e: MouseEvent) => {
            const { centerX, centerY, edgeY, anchorBottom } = computePosition(e.clientX, e.clientY);
            setShowSnapZone(isNearDefaultPosition(centerX, centerY));
            setPosition({ centerX, edgeY, anchorBottom });
        };

        const handleMouseUp = (e: MouseEvent) => {
            const { centerX, centerY, edgeY, anchorBottom } = computePosition(e.clientX, e.clientY);
            setPosition(isNearDefaultPosition(centerX, centerY) ? null : { centerX, edgeY, anchorBottom });
            setShowSnapZone(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    if (!portalRef.current) return null;

    const isExpanded = state.type === "EXPANDED";
    const size = isExpanded ? state.size : null;

    const getPositionStyle = (): React.CSSProperties => {
        if (!position) return { left: `${center}px`, bottom: "32px", transform: "translateX(-50%)" };
        const base = { left: `${position.centerX}px`, transform: "translateX(-50%)" };
        return position.anchorBottom ? { ...base, bottom: `${position.edgeY}px` } : { ...base, top: `${position.edgeY}px` };
    };

    return (
        <Portal container={portalRef.current}>
            {showSnapZone && (
                <div className="fixed bottom-8 z-999 w-[300px] h-[60px]" style={{ left: `${center}px`, transform: "translateX(-50%)" }}>
                    <div className="size-full border-2 border-dashed border-zinc-400/50 bg-zinc-400/10 rounded-full animate-pulse" />
                </div>
            )}

            <div
                ref={toolbarRef}
                role="toolbar"
                data-expanded={isExpanded}
                data-size={size}
                className={clsx(
                    "dynamic-island fixed z-1000 bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 shadow-2xl flex flex-col",
                    isExpanded && "rounded-3xl",
                    !isExpanded && "rounded-4xl p-2 justify-end cursor-move"
                )}
                style={getPositionStyle()}
                onMouseDown={!isExpanded ? startDrag : undefined}>
                {isExpanded ? (
                    <>
                        <button
                            type="button"
                            onMouseDown={startDrag}
                            className="h-6 cursor-move flex items-center justify-center shrink-0 rounded-t-3xl group/grab">
                            <div className="w-10 h-1 bg-zinc-700 rounded-full group-hover/grab:bg-zinc-400 transition-colors" />
                        </button>
                        <div className="dynamic-island-content px-6 pb-2">{state.content}</div>
                        <button
                            type="button"
                            onMouseDown={startDrag}
                            className="h-4 cursor-move shrink-0 rounded-b-3xl hover:bg-white/5 transition-colors"
                        />
                    </>
                ) : (
                    <div className="flex items-center gap-4 h-full">{children}</div>
                )}
            </div>
        </Portal>
    );
}
