import { clsx } from "@/lib/utils";

export default function Star({ className }: { className?: string }) {
    return (
        <div className={clsx(className, "w-full flex items-center gap-x-4")}>
            <div className="h-px flex-1 bg-linear-to-l from-zinc-700 to-transparent" />
            <img src="/icons/star.svg" alt="star" className="size-6 invert" />
            <div className="h-px flex-1 bg-linear-to-r from-zinc-700 to-transparent" />
        </div>
    );
}
