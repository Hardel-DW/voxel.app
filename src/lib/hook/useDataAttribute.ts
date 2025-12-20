import { useRef } from "react";

export function useDataAttribute<T extends HTMLElement = HTMLElement>({ name, initial }: { name: string; initial: boolean }) {
    const elementRef = useRef<T | null>(null);
    const valueRef = useRef<boolean>(initial);
    const ref = (node: T | null) => {
        elementRef.current = node;
        if (node && valueRef.current) node.dataset[name] = "";
    };

    const set = (value: boolean) => {
        valueRef.current = value;
        if (!elementRef.current) return;
        if (!value) {
            delete elementRef.current.dataset[name];
            return;
        }

        elementRef.current.dataset[name] = "";
    };

    const toggle = () => set(!valueRef.current);
    const get = () => valueRef.current;
    return { ref, set, toggle, get, initial };
}
