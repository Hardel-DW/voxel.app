export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    }) as T;
}


export async function trying<T>(fn: () => Promise<T>, onError: (e: unknown) => void): Promise<T | undefined> {
    try {
        return await fn();
    } catch (e) {
        onError(e);
        return undefined;
    }
}