import type { ComponentProps } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type RangeProps = Omit<ComponentProps<"input">, "onChange" | "value" | "min" | "max" | "step" | "label"> & {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    label?: string;
};

export default function Range(props: RangeProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const displayRef = useRef<HTMLSpanElement>(null);

    const handleMouseUp = () => {
        if (inputRef.current && props.onChangeEnd) {
            const finalValue = +inputRef.current.value;
            props.onChangeEnd(finalValue);
        }
    };

    return (
        <div className="relative w-full">
            {props.label && (
                <div className="flex justify-between items-center w-full mb-1">
                    <span className="block text-sm font-medium text-zinc-400">{props.label}</span>
                    <span ref={displayRef} className="text-sm font-medium text-zinc-400">
                        {props.value}
                    </span>
                </div>
            )}
            <input
                ref={inputRef}
                type="range"
                disabled={props.disabled}
                min={props.min}
                max={props.max}
                step={props.step}
                defaultValue={props.value}
                onInput={(e) => {
                    const newValue = +e.currentTarget.value;
                    if (displayRef.current) {
                        displayRef.current.textContent = newValue.toString();
                    }
                    props.onChange?.(newValue);
                }}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className={cn(
                    "h-6 w-full cursor-pointer appearance-none overflow-hidden rounded-2xl bg-transparent focus:outline-none",
                    "track:h-2 track:w-full track:rounded-2xl track:bg-tertiary track:border-none",
                    "thumb-webkit:relative thumb-webkit:top-1/2 thumb-webkit:-translate-y-1/2 thumb:h-6 thumb:w-6 thumb:appearance-none thumb:rounded-2xl thumb:border-none thumb:bg-black thumb:text-primary thumb:cursor-pointer thumb:slider-primary",
                    props.className
                )}
            />
        </div>
    );
}
