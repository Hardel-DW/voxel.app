import { useEffect, useEffectEvent, useRef } from "react";

type Handler = () => void;

export const useClickOutside = (handler: Handler, ignoreOtherPopovers = true) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = useEffectEvent((event: MouseEvent) => {
        const target = event.target as Node;
        if (ref.current && !ref.current.contains(target)) {
            if (ignoreOtherPopovers) {
                const clickedPopover = (target as Element).closest?.("[popover]");
                if (clickedPopover && clickedPopover !== ref.current) {
                    return;
                }
            }
            handler();
        }
    });

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return ref;
};
