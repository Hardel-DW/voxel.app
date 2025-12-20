import { Link } from "@tanstack/react-router";
import type React from "react";
import { cn } from "@/lib/utils";

const variants = {
    variant: {
        default: "bg-zinc-200 text-zinc-800 border-2 border-zinc-500 hover:bg-zinc-300",
        black: "bg-black text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-900",
        ghost: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-zinc-200 hover:text-zinc-800",
        ghost_border:
            "bg-transparent text-zinc-200 border-2 border-zinc-900 ring-zinc-900 hover:text-zinc-100 hover:border-zinc-700 hover:ring-zinc-700",
        aurora: "bg-transparent border-2 border-zinc-900 ring-zinc-900 hover:text-zinc-100 hover:ring-zinc-700 w-full justify-between bg-linear-to-r from-transparent from-30% to-zinc-700/30 hover:from-10% hover:border-zinc-800 text-xs text-zinc-400",
        transparent: "bg-transparent text-zinc-200 border-2 border-zinc-500 hover:bg-white/10",
        link: "bg-transparent hover:text-white text-zinc-400",
        shimmer: "shimmer-white text-black font-medium border-t border-l border-zinc-900 hover:opacity-75 transition",
        patreon: "shimmer-orange-700 text-white hover:scale-95 transition flex items-center gap-4 place-self-end rounded-xl"
    },
    size: {
        none: "",
        square: "h-10 p-2",
        default: "h-10 px-4 py-2",
        xs: "h-6 rounded px-3 py-2",
        sm: "h-9 rounded-md px-3",
        md: "h-10 rounded-md px-4",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10",
        "2xl": "h-12 rounded-md px-16",
        "3xl": "h-12 rounded-md px-20",
        icon: "h-12 w-12 p-2"
    }
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants.variant;
    size?: keyof typeof variants.size;
    href?: string;
    to?: string;
    target?: string;
    params?: Record<string, string>;
    search?: Record<string, unknown>;
}

export function Button({
    variant = "default",
    size = "default",
    className,
    href,
    to,
    params,
    search,
    target,
    children,
    ...rest
}: ButtonProps) {
    const baseClassName = cn([
        "rounded-xl inline-flex items-center justify-center whitespace-nowrap cursor-pointer truncate text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants.variant[variant],
        variants.size[size],
        className
    ]);

    if (to) {
        return (
            <Link to={to} params={params} search={search} className={baseClassName}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} target={target} className={baseClassName} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={baseClassName} {...rest}>
            {children}
        </button>
    );
}
