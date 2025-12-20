import type React from "react";
import { cn } from "@/lib/utils";

interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function SimpleCard({ children, className, ...props }: SimpleCardProps) {
    return (
        <div
            className={cn(
                "bg-black/35 border border-zinc-900 cursor-pointer relative transition-transform duration-150 ease-out hover:-translate-y-1 py-6 px-8 rounded-xl isolate",
                className
            )}
            {...props}>
            {children}
            <div className="absolute inset-0 -z-10 brightness-15">
                <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
            </div>
        </div>
    );
}
