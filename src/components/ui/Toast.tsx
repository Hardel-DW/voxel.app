import { useState } from "react";
import { create } from "zustand";
import Portal from "@/components/ui/Portal";
import { cn } from "@/lib/utils";

export const TOAST = {
    DEFAULT: "default",
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
    WARNING: "warning"
};

const variantStyles: Record<(typeof TOAST)[keyof typeof TOAST], string> = {
    default: "border-zinc-200 bg-white text-zinc-900",
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900"
};

const variantIcons: Record<(typeof TOAST)[keyof typeof TOAST], string | null> = {
    default: null,
    success: "/icons/toast/success.svg",
    error: "/icons/toast/error.svg",
    info: "/icons/toast/info.svg",
    warning: "/icons/toast/warning.svg"
};

interface Toast {
    id: string;
    message: string;
    description?: string;
    variant: (typeof TOAST)[keyof typeof TOAST];
    removing?: boolean;
}

interface ToastStore {
    toasts: Toast[];
    queue: Array<{ message: string; description?: string; variant: (typeof TOAST)[keyof typeof TOAST] }>;
    addToast: (message: string, variant: (typeof TOAST)[keyof typeof TOAST], description?: string) => void;
    removeToast: (id: string) => void;
    processQueue: () => void;
}

const MAX_TOASTS = 5;
const DURATION = 4000;
const TRANSITION_DURATION = 200;
const QUEUE_DELAY = 800;

const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    queue: [],
    addToast: (message, variant, description) => {
        const state = get();
        if (state.toasts.length >= MAX_TOASTS) {
            set((state) => ({ queue: [...state.queue, { message, variant, description }] }));
            return;
        }

        const id = Math.random().toString(36).substring(2, 11);
        set((state) => ({ toasts: [...state.toasts, { id, message, variant, description }] }));
        setTimeout(() => get().removeToast(id), DURATION);
    },
    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.map((t) => (t.id === id ? { ...t, removing: true } : t)) }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
            get().processQueue();
        }, TRANSITION_DURATION);
    },
    processQueue: () => {
        const state = get();
        if (state.queue.length > 0 && state.toasts.length < MAX_TOASTS) {
            setTimeout(() => {
                const [next, ...remaining] = get().queue;
                if (next) {
                    set({ queue: remaining });
                    get().addToast(next.message, next.variant, next.description);
                }
            }, QUEUE_DELAY);
        }
    }
}));

export function toast(message: string, variant: (typeof TOAST)[keyof typeof TOAST] = TOAST.DEFAULT, description?: string) {
    useToastStore.getState().addToast(message, variant, description);
}

function ToastItem({ toast: toastItem }: { toast: Toast }) {
    const removeToast = useToastStore((state) => state.removeToast);
    const asset = variantIcons[toastItem.variant];

    return (
        <div
            role="alert"
            hidden={toastItem.removing}
            className={cn(
                "flex select-none items-center gap-2 rounded-xl border px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-86 starting:translate-y-full starting:opacity-0 hidden:opacity-0 hidden:scale-95 hidden:-translate-y-full discrete",
                variantStyles[toastItem.variant]
            )}>
            {typeof asset === "string" && <img src={asset} alt="Icon" className="size-5 shrink-0" />}
            <div className="flex-1">
                <p className="text-sm font-medium">{toastItem.message}</p>
                {toastItem.description && <p className="text-xs opacity-80 mt-1">{toastItem.description}</p>}
            </div>
            <button
                type="button"
                onClick={() => removeToast(toastItem.id)}
                className="shrink-0 rounded-md p-1 transition-colors hover:bg-current/10 cursor-pointer"
                aria-label="Close">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export function Toaster() {
    const toasts = useToastStore((state) => state.toasts);
    const [heights, setHeights] = useState(new Map<string, number>());

    if (toasts.length === 0) return null;

    const getOffset = (stackIndex: number) => toasts.slice(0, stackIndex).reduce((sum, t) => sum + (heights.get(t.id) || 64) + 8, 0);

    return (
        <Portal>
            <div className="group pointer-events-none fixed right-0 bottom-0 z-50 p-4">
                <div className="pointer-events-auto relative flex flex-col items-end">
                    {toasts.map((toast, index) => {
                        const stackIndex = toasts.length - 1 - index;
                        return (
                            <div
                                key={toast.id}
                                ref={(el) => {
                                    if (el && !heights.has(toast.id)) {
                                        setHeights(new Map(heights.set(toast.id, el.offsetHeight)));
                                    }
                                }}
                                style={
                                    {
                                        "--translateY": `${stackIndex * -8}px`,
                                        "--hoverTranslateY": `${-getOffset(stackIndex)}px`,
                                        "--scale": `${1 - stackIndex * 0.03}`,
                                        zIndex: index + 1
                                    } as React.CSSProperties
                                }
                                className="absolute right-0 bottom-0 transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] translate-y-(--translateY) scale-(--scale) group-hover:translate-y-(--hoverTranslateY) group-hover:scale-100 before:absolute before:inset-0 before:-inset-y-4 before:content-[''] before:-z-10">
                                <ToastItem toast={toast} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </Portal>
    );
}
