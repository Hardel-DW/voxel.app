import { createContext, type ReactNode, useContext, useRef, useState } from "react";

export interface DisclosureState<T extends HTMLElement> {
    open: boolean;
    setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    triggerRef: React.RefObject<T | null>;
}

export function createDisclosureContext<T extends HTMLElement>() {
    const Context = createContext<DisclosureState<T> | null>(null);

    function Provider({ children, defaultOpen = false }: { children: ReactNode; defaultOpen?: boolean }) {
        const [open, setOpen] = useState(defaultOpen);
        const triggerRef = useRef<T>(null);

        return <Context.Provider value={{ open, setOpen, triggerRef }}>{children}</Context.Provider>;
    }

    function useDisclosure() {
        const context = useContext(Context);
        if (!context) {
            throw new Error("useDisclosure must be used within a DisclosureProvider");
        }
        return context;
    }

    return {
        Provider,
        useDisclosure
    };
}
