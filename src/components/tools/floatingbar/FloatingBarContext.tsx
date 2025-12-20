import { createContext, type ReactNode, useContext, useRef, useState } from "react";

export type ToolbarSize = "large" | "fit";

type FloatingBarState = { type: "COLLAPSED" } | { type: "EXPANDED"; content: ReactNode; size: ToolbarSize };

interface FloatingBarContextValue {
    portalRef: React.RefObject<HTMLDivElement | null>;
    containerCenter: number | null;
    state: FloatingBarState;
    expand: (content: ReactNode, size?: ToolbarSize) => void;
    collapse: () => void;
    resize: (size: ToolbarSize) => void;
    setContainerRef: (element: HTMLElement | null) => void;
}

const FloatingBarContext = createContext<FloatingBarContextValue | null>(null);

export function FloatingBarProvider({ children }: { children: ReactNode }) {
    const portalRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<FloatingBarState>({ type: "COLLAPSED" });
    const [containerCenter, setContainerCenter] = useState<number | null>(null);

    const computeCenter = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return rect.left + rect.width / 2;
    };

    const setContainerRef = (element: HTMLElement | null) => {
        containerRef.current = element;
        setContainerCenter(element ? computeCenter(element) : null);
    };

    const expand = (content: ReactNode, size: ToolbarSize = "large") => {
        setState({ type: "EXPANDED", content, size });
    };

    const collapse = () => {
        if (state.type !== "EXPANDED") return;
        setState({ type: "COLLAPSED" });
    };

    const resize = (size: ToolbarSize) => {
        if (state.type !== "EXPANDED") return;
        setState((prev) => (prev.type === "EXPANDED" ? { ...prev, size } : prev));
    };

    return (
        <FloatingBarContext.Provider value={{ portalRef, containerCenter, state, expand, collapse, resize, setContainerRef }}>
            {children}
            <div ref={portalRef} id="floating-bar-portal" />
        </FloatingBarContext.Provider>
    );
}

export function useFloatingBarPortal() {
    const context = useContext(FloatingBarContext);
    if (!context) {
        throw new Error("useFloatingBarPortal must be used within FloatingBarProvider");
    }
    return context;
}

export function useDynamicIsland() {
    const context = useContext(FloatingBarContext);
    if (!context) {
        throw new Error("useDynamicIsland must be used within FloatingBarProvider");
    }
    return {
        isExpanded: context.state.type === "EXPANDED",
        expand: context.expand,
        collapse: context.collapse,
        resize: context.resize,
        setContainerRef: context.setContainerRef
    };
}
