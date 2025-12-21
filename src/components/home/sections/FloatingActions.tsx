export default function FloatingActions() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 p-2 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer font-medium text-sm">
                <span>Start New Project</span>
            </button>
            <div className="w-px h-6 bg-zinc-800" />
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all cursor-pointer text-sm">
                <span>Import (Drag & Drop)</span>
            </button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all cursor-pointer text-sm">
                <img src="/icons/company/github.svg" alt="Github" className="size-4" />
                <span>Github</span>
            </button>
        </div>
    );
}