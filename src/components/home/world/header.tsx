import { revealItemInDir } from "@tauri-apps/plugin-opener";

export default function Header(props: { name: string; path: string; total: number; iconSrc?: string; onBack: () => void }) {
    return (
        <header className="shrink-0 h-32 w-full flex flex-col justify-end px-12 pb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-16 rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-md overflow-hidden">
                        {props.iconSrc ? (
                            <img src={props.iconSrc} alt={props.name} className="size-full object-cover" />
                        ) : (
                            <div className="size-full flex items-center justify-center">
                                <svg className="size-8 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{props.name}</h1>
                        <p className="text-sm text-zinc-500">{props.total} items</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => revealItemInDir(props.path)}
                        className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white transition-all">
                        <img src="/icons/dots-vertical.svg" alt="Options" className="size-4 invert-50" />
                    </button>
                    <button
                        type="button"
                        onClick={props.onBack}
                        className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white transition-all">
                        <img src="/icons/arrow-left.svg" alt="Back" className="size-4 invert-50" />
                    </button>
                </div>
            </div>
        </header>
    );
}
