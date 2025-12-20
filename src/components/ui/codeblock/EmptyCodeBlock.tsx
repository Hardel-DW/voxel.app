export default function EmptyCodeBlock(props: { title?: string; children: React.ReactNode }) {
    return (
        <div className="relative w-full h-full py-4 pl-4 pr-px bg-zinc-950/20 rounded-2xl border-zinc-800 border">
            <div className="flex h-4 mr-16">
                <div className="flex items-center z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                </div>
                <div className="flex items-center justify-center w-full text-sm font-medium z-20 text-ellipsis whitespace-nowrap m-0 p-0 text-center">
                    {props.title && <span className="text-secondary">{props.title}</span>}
                </div>
            </div>
            <div className="overflow-auto h-full w-full z-10">
                <div className="h-auto text-white pt-4 bg-transparent border-none text-base relative overflow-hidden">
                    <p className="text-zinc-500">{props.children}</p>
                </div>
            </div>
        </div>
    );
}
