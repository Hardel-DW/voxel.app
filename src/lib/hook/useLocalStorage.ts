import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const [value, setValue] = useState<T | undefined>(() => {
        if (typeof document === "undefined") return initialValue;
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    useEffect(() => {
        const handler = (e: CustomEvent<T>) => setValue(e.detail);
        window.addEventListener(`storage:${key}` as keyof WindowEventMap, handler as EventListener);
        return () => window.removeEventListener(`storage:${key}` as keyof WindowEventMap, handler as EventListener);
    }, [key]);

    const set = (next: T | ((prev: T | undefined) => T)) => {
        setValue((prev) => {
            const val = next instanceof Function ? next(prev) : next;
            localStorage.setItem(key, JSON.stringify(val));
            window.dispatchEvent(new CustomEvent(`storage:${key}`, { detail: val }));
            return val;
        });
    };

    return [value, set] as const;
}
