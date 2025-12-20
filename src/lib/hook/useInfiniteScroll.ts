import { useRef, useState } from "react";

export function useInfiniteScroll<T>(items: T[], itemsPerPage = 50, resetKeys: string[] = []) {
    const [count, setCount] = useState(itemsPerPage);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const scrollContainerRef = useRef<Element | null>(null);
    const itemsLengthRef = useRef(items.length);
    const resetKeysRef = useRef(resetKeys);
    itemsLengthRef.current = items.length;

    const keysChanged = resetKeys.length !== resetKeysRef.current.length || resetKeys.some((key, i) => key !== resetKeysRef.current[i]);
    if (keysChanged) {
        resetKeysRef.current = resetKeys;
        if (count !== itemsPerPage) {
            setCount(itemsPerPage);
        }
        scrollContainerRef.current?.scrollTo({ top: 0 });
    }

    const visibleItems = items.slice(0, count);
    const hasMore = count < items.length;

    const setRef = (element: HTMLDivElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        if (!element) return;
        const scrollParent = element.closest(".overflow-y-auto");
        scrollContainerRef.current = scrollParent;
        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCount((prev) => Math.min(prev + itemsPerPage, itemsLengthRef.current));
                }
            },
            {
                root: scrollParent,
                rootMargin: "100px"
            }
        );
        observerRef.current.observe(element);
    };

    return { visibleItems, hasMore, ref: setRef };
}
