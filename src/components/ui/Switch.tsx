import { useId } from "react";
import { cn } from "@/lib/utils";

export function Switch(props: {
    label?: string;
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => void;
    disabled?: boolean;
    id?: string;
}) {
    const id = useId();
    return (
        <div className="flex items-center gap-x-3">
            <label
                htmlFor={props.id ?? id}
                className={cn("relative inline-block w-11 h-6 cursor-pointer", props.disabled && "opacity-50 pointer-events-none")}>
                <input
                    type="checkbox"
                    id={props.id ?? id}
                    className="peer sr-only"
                    checked={props.isChecked}
                    onChange={(e) => props.setIsChecked(e.target.checked)}
                    disabled={props.disabled}
                />
                <span className="absolute inset-0 bg-unchecked-rail rounded-full transition-all duration-100 ease-in-out peer-checked:linear-checked-rail peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-unchecked-circle rounded-full transition-all duration-200 ease-in-out peer-checked:translate-x-full peer-checked:duration-300 peer-checked:bg-checked-circle"></span>
            </label>
            {props.label && (
                <label htmlFor={props.id ?? id} className="text-sm text-gray-400">
                    {props.label}
                </label>
            )}
        </div>
    );
}
