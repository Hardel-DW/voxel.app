import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ToolbarTextButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick"> {
    icon: string;
    tooltip?: string;
    onClick: () => void;
    disabled?: boolean;
    labelText: string;
}

export function ToolbarTextButton({ icon, tooltip, onClick, disabled, labelText, className, ...props }: ToolbarTextButtonProps) {
    const t = useTranslate();

    return (
        <button
            type="button"
            {...props}
            onClick={onClick}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={disabled}
            title={tooltip}
            className={cn(
                "h-10 px-3 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 border border-zinc-700/50",
                className
            )}>
            <img src={icon} alt="Toolbar text button icon" className="w-4 h-4 invert opacity-75 select-none user-select-none" />
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">{t(labelText)}</span>
        </button>
    );
}
