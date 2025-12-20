import { cn } from "@/lib/utils";

export default function Loader({ className }: { className?: string }) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className={cn("w-32 h-32 border-4 border-zinc-900 border-t-zinc-400 rounded-full animate-spin", className)} />
        </div>
    );
}
