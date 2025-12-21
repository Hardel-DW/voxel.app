import { useHomeStore } from "@/components/home/HomeStore";
import { cn } from "@/lib/utils";

const assets = [
    "/images/addons/card/dnt/snowy.webp",
    "/images/addons/card/dnt/toxic_lair.webp",
    "/images/addons/card/dnt/shrine.webp",
    "/images/addons/card/dnt/shrine_ominous.webp",
    "/images/addons/card/dnt/pale_residence.webp",
    "/images/addons/card/dnt/nether_keep.webp",
    "/images/addons/card/dnt/illager.webp",
    "/images/addons/card/dnt/illager_outpost.webp",
    "/images/addons/card/dnt/creeping_crypt.webp"
];

const mocks = assets.map((asset, index) => ({
    id: `${index + 1}`,
    name: `Client ${index + 1}`,
    version: `1.${20 + index}.${index * 10}`,
    asset: asset,
    date: new Date(2025, 11 - index, 21 - index * 3),
}));

const instances = [
    "Official Launcher", "Modrinth", "CurseForge"
]

export default function GameClients() {
    const clients = useHomeStore((s) => s.gameClients);

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200 px-8">Game Clients</h2>
            <div className="p-8 mx-2 rounded-2xl bg-editor/40 backdrop-blur-sm relative z-50 border border-zinc-800/50">
                <div className="overflow-hidden space-y-8">
                    {instances.map((instance, index) => (
                        <>
                            <div key={`${instance}-${index.toString()}`} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold text-zinc-200">{instance}</h2>
                                    <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">
                                        {clients.length}
                                    </span>
                                </div>
                                <div className="flex gap-8 -mx-8 px-8">
                                    {mocks.map((mock) => (
                                        <div key={`${mock.id}-${mock.name}`} className="group flex flex-col justify-between rounded-xl shadow-lg shadow-zinc-950/30 bg-zinc-900/30 border border-zinc-800/50 min-w-60 overflow-hidden cursor-pointer">
                                            <div className="overflow-hidden">
                                                <img src={mock.asset} alt={mock.name} className="w-full h-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-110" />
                                            </div>
                                            <div className="p-2">
                                                <p className="font-semibold text-zinc-200 tracking-tight">{mock.name}</p>
                                                <p className="text-[10px] font-medium text-zinc-500">
                                                    {mock.date.toLocaleDateString('fr-FR', { month: 'long' })} {mock.version}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {index < instances.length - 1 && (
                                <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />
                            )}
                        </>
                    ))}
                </div>

                <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />

                <button
                    type="button"
                    className={cn(
                        "group relative flex flex-col items-center justify-center w-full p-6 transition-all duration-300 rounded-3xl border-2 border-dashed cursor-pointer",
                        "border-zinc-700/50 bg-zinc-900/20 backdrop-blur-sm",
                        "hover:bg-zinc-800/30 hover:border-zinc-500"
                    )}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                            <svg className="w-6 h-6 text-zinc-400 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-200 transition-colors">
                                Ajouter un client de jeu
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                Cliquez pour configurer un nouveau client
                            </p>
                        </div>
                    </div>
                </button>
            </div>
        </section>
    );
}
