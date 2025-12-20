import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
    image: string;
    loading?: "lazy" | "eager";
    children?: React.ReactNode;
}

const Box = ({ image, loading, className, children, ...props }: Props) => {
    return (
        <div
            className={cn(
                "group relative z-1 flex flex-col items-center justify-between gap-y-4 bg-header-translucent cursor-pointer border-t-2 border-r border-zinc-800 p-8 rounded-3xl shadow-2xl shadow-black transition opacity-75 hover:opacity-100 hover:ring-zinc-800 hover:ring-2",
                className
            )}
            {...props}>
            <div className="flex justify-center h-full">
                <img
                    loading={loading}
                    width="500"
                    height="500"
                    src={image}
                    alt="404"
                    className="size-48 pixelated select-none self-center group-hover:animate-levitate duration-200"
                />
            </div>

            <div>
                <div className="hidden group-hover:block absolute -z-10 top-0 left-0 w-full h-full bg-linear-to-r from-pink-900 to-blue-900 opacity-30 rounded-full blur-[5rem]" />
                {children}
            </div>
        </div>
    );
};

export default Box;
