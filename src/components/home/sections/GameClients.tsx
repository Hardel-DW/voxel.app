import { type ClientType, type GameClient, useHomeStore } from "@/components/home/HomeStore";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CLIENT_ICONS: Record<ClientType, string> = {
    vanilla: "/icons/logo.svg",
    modrinth: "/icons/logo.svg",
    curseforge: "/icons/logo.svg",
    custom: "/icons/folder.svg"
};

const CLIENT_COLORS: Record<ClientType, string> = {
    vanilla: "bg-green-500/10 border-green-500/20 text-green-400",
    modrinth: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    curseforge: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    custom: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
};

interface ClientCardProps {
    client: GameClient;
    isExpanded: boolean;
    onToggle: () => void;
}

function ClientCard({ client, isExpanded, onToggle }: ClientCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border transition-all overflow-hidden",
                isExpanded
                    ? "bg-zinc-900/60 border-zinc-700/50"
                    : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50"
            )}>
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 text-left cursor-pointer">
                <div className={cn(
                    "size-12 rounded-xl flex items-center justify-center border shrink-0",
                    CLIENT_COLORS[client.type]
                )}>
                    <img
                        src={CLIENT_ICONS[client.type]}
                        alt=""
                        className="size-6"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200">{client.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{client.path}</p>
                </div>
                <div className="flex items-center gap-3">
                    {client.instanceCount !== undefined && client.instanceCount > 0 && (
                        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                            {t("home.clients.worlds", { count: client.instanceCount })}
                        </span>
                    )}
                    <svg
                        className={cn(
                            "size-4 text-zinc-500 transition-transform",
                            isExpanded && "rotate-180"
                        )}
                        viewBox="0 0 16 16"
                        fill="none">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800/50">
                    <div className="py-6 text-center">
                        <p className="text-sm text-zinc-500">{t("home.clients.scan")}</p>
                        <button
                            type="button"
                            className="mt-3 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg transition-colors cursor-pointer">
                            {t("home.clients.browse")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function AddClientButton() {
    return (
        <button
            type="button"
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/50 transition-all text-left group cursor-pointer">
            <div className="size-12 rounded-xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center group-hover:bg-zinc-800/50 transition-colors">
                <svg className="size-5 text-zinc-500 group-hover:text-zinc-400 transition-colors" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
            <div>
                <p className="font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {t("home.clients.add")}
                </p>
                <p className="text-xs text-zinc-600">{t("home.clients.add.hint")}</p>
            </div>
        </button>
    );
}

export default function GameClients() {
    const clients = useHomeStore((s) => s.gameClients);
    const expandedId = useHomeStore((s) => s.expandedClientId);
    const setExpanded = useHomeStore((s) => s.setExpandedClient);

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-zinc-200">{t("home.clients.title")}</h2>
                <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">
                    {clients.length}
                </span>
            </div>
            <div className="space-y-3">
                {clients.map((client) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        isExpanded={expandedId === client.id}
                        onToggle={() => setExpanded(expandedId === client.id ? null : client.id)}
                    />
                ))}
                <AddClientButton />
            </div>
        </section>
    );
}
