import { createContext, type ReactNode, useContext } from "react";
import { createPortal } from "react-dom";

const PortalContainerContext = createContext<HTMLElement | null>(null);

export function PortalContainerProvider({ children, container }: { children: ReactNode; container: HTMLElement | null }) {
    return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>;
}

export default function Portal({ children, container }: { children: ReactNode; container?: HTMLElement }) {
    const contextContainer = useContext(PortalContainerContext);
    return createPortal(children, container ?? contextContainer ?? document.body);
}
