import { cn } from "@/lib/utils";

interface SquareButtonProps {
    icon: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    active?: boolean;
    className?: string;
    title?: string;
}

export default function SquareButton({
    icon,
    onClick,
    variant = "default",
    size = "md",
    disabled = false,
    active = false,
    className,
    title
}: SquareButtonProps) {
    const sizeClasses = {
        sm: "p-2 w-8 h-8",
        md: "p-2 w-10 h-10",
        lg: "p-2 w-12 h-12"
    };

    const variantClasses = {
        default: "bg-black/35 border border-zinc-800 hover:border-zinc-700",
        outline: "border-2 border-zinc-700 hover:border-zinc-600 hover:bg-black/20",
        ghost: "hover:bg-black/30"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "relative transition-colors duration-200 rounded-lg select-none cursor-pointer flex items-center justify-center",
                sizeClasses[size],
                variantClasses[variant],
                {
                    "ring-1 ring-zinc-600 bg-zinc-950/50": active,
                    "opacity-50 cursor-not-allowed": disabled
                },
                className
            )}
            onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onClick && !disabled) {
                    e.preventDefault();
                    onClick();
                }
            }}
            tabIndex={disabled ? -1 : 0}>
            <img src={icon} alt={icon} className={cn("invert transition-all", iconSizes[size])} />
        </button>
    );
}
