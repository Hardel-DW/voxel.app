export default function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center opacity-60">
                <div className="size-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-5 border border-zinc-800">
                    <img src={icon} className="size-10 invert opacity-40" alt="Icon" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-1">{title}</h3>
                <p className="text-zinc-500 text-sm max-w-sm text-center">{description}</p>
            </div>
        </div>
    );
}
