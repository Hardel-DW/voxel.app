import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { cn } from "@/lib/utils";

export type ToolSlotType = BaseInteractiveComponent & {
    description?: string;
    title: string;
    image: string;
    size?: number;
    align?: "left" | "center" | "right";
    onBeforeChange?: () => void;
};

export default function ToolSlot(props: ToolSlotType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolSlotType, boolean>({ component: props });
    if (value === null) return null;

    const handleClick = () => {
        props.onBeforeChange?.();
        handleChange(!value);
    };

    return (
        <button
            type="button"
            className={cn(
                "bg-black/35 border cursor-pointer border-zinc-900 select-none relative rounded-xl p-4 flex flex-col transition-transform duration-150 ease-out hover:-translate-y-1 isolate",
                { "bg-zinc-950/50 ring-1 ring-zinc-700": value },
                { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
            )}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClick();
            }}
            tabIndex={0}>
            {value && !lock.isLocked && (
                <div className="absolute p-4 top-0 right-0">
                    <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />
                </div>
            )}

            {lock.isLocked && (
                <div className="absolute p-4 top-0 right-0">
                    <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6 invert" />
                </div>
            )}

            {lock.isLocked && <span className="absolute p-4 bottom-0 right-0 text-xs text-zinc-400 font-light">{lock.text}</span>}

            <div className="flex flex-col items-center justify-between h-full">
                <div
                    className={cn(
                        "mb-8 w-full",
                        { "text-left px-4": props.align === "left" },
                        { "text-center px-4": props.align === "center" },
                        { "text-right px-4": props.align === "right" }
                    )}>
                    <h3 className="text-lg font-semibold mb-1">{props.title}</h3>
                    {props.description && <p className="text-sm text-zinc-400">{props.description}</p>}
                </div>

                <img
                    src={props.image}
                    alt={props.title.toString()}
                    className="mb-8 pixelated"
                    style={{
                        height: props.size ? `${props.size}px` : "64px"
                    }}
                />
            </div>
            <div className="absolute inset-0 -z-10 brightness-15 top-0">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
            </div>
        </button>
    );
}
