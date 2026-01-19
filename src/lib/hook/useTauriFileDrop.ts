import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useEffect, useState } from "react";

export function useTauriFileDrop(onDrop?: (paths: string[]) => void) {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const promise = getCurrentWebview().onDragDropEvent((event) => {
            const type = event.payload.type;

            if (type === "enter" || type === "over") {
                setIsDragging(true);
            } else if (type === "drop") {
                setIsDragging(false);
                onDrop?.(event.payload.paths);
            } else {
                setIsDragging(false);
            }
        });

        return () => {
            promise.then((unlisten) => unlisten());
        };
    }, [onDrop]);

    return { isDragging };
}
