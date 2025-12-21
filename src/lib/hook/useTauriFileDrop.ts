import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useRef, useState, useSyncExternalStore } from "react";

interface TauriDropState {
    isDragging: boolean;
    paths: string[];
}

const initialState: TauriDropState = { isDragging: false, paths: [] };

export function useTauriFileDrop(onDrop: (paths: string[]) => void) {
    const [state, setState] = useState<TauriDropState>(initialState);
    const unlistenRef = useRef<(() => void) | null>(null);
    const onDropRef = useRef(onDrop);
    onDropRef.current = onDrop;

    const subscribe = (callback: () => void) => {
        let isMounted = true;

        getCurrentWebview()
            .onDragDropEvent((event) => {
                if (!isMounted) return;

                const { type } = event.payload;

                if (type === "enter" || type === "over") {
                    setState({ isDragging: true, paths: [] });
                    callback();
                } else if (type === "drop") {
                    const paths = event.payload.paths;
                    setState({ isDragging: false, paths });
                    onDropRef.current(paths);
                    callback();
                } else if (type === "leave") {
                    setState(initialState);
                    callback();
                }
            })
            .then((unlisten) => {
                if (isMounted) {
                    unlistenRef.current = unlisten;
                } else {
                    unlisten();
                }
            });

        return () => {
            isMounted = false;
            unlistenRef.current?.();
            unlistenRef.current = null;
        };
    };

    const getSnapshot = () => state;

    useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return { isDragging: state.isDragging };
}
