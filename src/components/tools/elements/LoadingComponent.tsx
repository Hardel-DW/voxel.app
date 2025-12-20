export default function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-zinc-700" />
            <div className="text-zinc-400 text-sm font-light">Loading roadmap...</div>
        </div>
    );
}
