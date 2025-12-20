import { type SVGProps, useId } from "react";
import { cn } from "@/lib/utils";

interface Props extends SVGProps<SVGSVGElement> {}

export function DashedPattern({ className, ...props }: Props) {
    return (
        <svg
            className={cn(
                "size-full -z-10 absolute stroke-zinc-500/30 mask-[radial-gradient(white,transparent_70%)] [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-6",
                className
            )}
            {...props}>
            <defs>
                <pattern id={useId()} viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                    <path d="M64 0H0V64" fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" strokeWidth="0" />
        </svg>
    );
}
