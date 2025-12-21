import { Button } from "@/components/ui/Button";

export function ContentCard(props: { title: string; author: string; version: string; type: string }) {
    return (
        <div className="group relative flex items-center gap-4 p-3 rounded-2xl backdrop-blur-md bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-800 hover:bg-zinc-900/90 transition-all duration-300">
            <div className="size-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                    src="/images/addons/icon/yggdrasil.webp"
                    alt="Yggdrasil"
                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{props.title}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="truncate">
                        by <span className="text-zinc-200">{props.author}</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{props.version}</span>
                </div>
            </div>

            <Button variant="ghost" className="border-zinc-700">
                Configure
            </Button>
        </div>
    );
}
