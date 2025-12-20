import type React from "react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
    value: number;
    min: number;
    max: number;
    step: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
}

export default function Counter({ value, min, max, step, disabled, onChange }: CounterProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDecrease = () => {
        if (disabled) return;

        const newValue = Math.max(min, value - step);
        onChange?.(newValue);
    };

    const handleIncrease = () => {
        if (disabled) return;

        const newValue = Math.min(max, value + step);
        onChange?.(newValue);
    };

    const handleValueClick = () => {
        if (disabled) return;

        setIsEditing(true);
        setInputValue(value.toString());
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const numbersOnly = e.target.value.replace(/[^0-9]/g, "");
        setInputValue(numbersOnly);
    };

    const handleInputBlur = () => {
        if (disabled) return;

        setIsEditing(false);
        const newValue = Number(inputValue);
        if (!Number.isNaN(newValue)) {
            const clampedValue = Math.min(max, Math.max(min, newValue));
            onChange?.(clampedValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    };

    const handleSpanKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (disabled) return;

        if (e.key === "Enter" || e.key === " ") {
            handleValueClick();
        }
    };

    return (
        <div className="relative z-20 w-20 h-10 border-2 rounded-3xl border-solid border-zinc-700 hover:border-white border-opacity-20 transition-[width] duration-500 ease-in-out hover:w-32 hover:border-opacity-100 group">
            <button
                type="button"
                onClick={handleIncrease}
                onKeyDown={handleSpanKeyDown}
                tabIndex={0}
                className="group-hover:opacity-100 group-hover:right-3 absolute z-20 top-1/2 right-4 block w-3 h-3 border-t-2 border-r-2 border-white transform -translate-y-1/2 rotate-45 cursor-pointer opacity-0 transition duration-500 ease-in-out hover:opacity-100"
            />
            <button
                type="button"
                onClick={handleDecrease}
                onKeyDown={handleSpanKeyDown}
                tabIndex={0}
                className="group-hover:opacity-100 group-hover:left-3 absolute z-20 top-1/2 left-4 block w-3 h-3 border-t-2 border-l-2 border-white transform -translate-y-1/2 -rotate-45 cursor-pointer opacity-0 transition duration-500 ease-in-out hover:opacity-100"
            />
            <div className="absolute z-10 inset-0 flex justify-center items-center select-none">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="custom"
                        value={inputValue}
                        disabled={disabled}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        className="w-16 text-center bg-transparent outline-none font-bold text-xl text-white"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={handleValueClick}
                        onKeyDown={handleSpanKeyDown}
                        className={cn("font-bold text-xl text-white cursor-text", disabled && "cursor-not-allowed")}>
                        {value}
                    </button>
                )}
            </div>
        </div>
    );
}
