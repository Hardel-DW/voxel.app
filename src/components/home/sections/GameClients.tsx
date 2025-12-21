import { Link } from "@tanstack/react-router";
import AddGameClientDialog from "@/components/home/AddGameClientDialog";
import { type GameClient, type GameInstance, useHomeStore } from "@/components/home/HomeStore";
import { t } from "@/lib/i18n";
import { convertIconToSrc } from "@/lib/utils/gameInstances";

export default function GameClients() {
    const gameClients = useHomeStore((s) => s.gameClients);
    const gameInstances = useHomeStore((s) => s.gameInstances);

    const groupedClients = Object.groupBy(gameClients, (client) => client.type);

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200 px-8">{t("home.gameClients")}</h2>
            <div className="p-8 mx-2 rounded-2xl bg-editor/40 backdrop-blur-sm relative z-50 border border-zinc-800/50">
                <div className="overflow-hidden space-y-8">
                    {Object.entries(groupedClients).map(([type, clients], index) => (
                        <ClientGroup
                            key={type}
                            clients={clients ?? []}
                            instances={gameInstances}
                            showDivider={index < Object.keys(groupedClients).length - 1}
                        />
                    ))}

                    {gameClients.length === 0 && <EmptyState />}
                </div>

                {gameClients.length > 0 && <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent my-8" />}

                <AddGameClientDialog />
            </div>
        </section>
    );
}

function ClientGroup(props: { clients: GameClient[]; instances: GameInstance[]; showDivider: boolean }) {
    if (props.clients.length === 0) return null;

    const firstClient = props.clients[0];
    const clientInstances = props.instances.filter((i) => props.clients.some((c) => c.id === i.clientId));

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-zinc-200">{firstClient.name}</h3>
                    <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{clientInstances.length}</span>
                </div>

                {clientInstances.length > 0 ? (
                    <div className="flex gap-4 -mx-8 px-8 overflow-x-auto pb-2">
                        {clientInstances.map((instance) => (
                            <InstanceCard key={instance.id} instance={instance} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">{t("home.noInstances")}</p>
                )}
            </div>

            {props.showDivider && <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />}
        </>
    );
}

function InstanceCard(props: { instance: GameInstance }) {
    const { instance } = props;
    const iconSrc = convertIconToSrc(instance.iconPath);
    const formattedDate = new Date(instance.lastModified).toLocaleDateString("fr-FR", {
        month: "long",
        day: "numeric"
    });

    return (
        <Link
            to="/world"
            search={{ instanceId: instance.id }}
            className="group flex flex-col justify-between rounded-xl shadow-lg shadow-zinc-950/30 bg-zinc-900/30 border border-zinc-800/50 min-w-60 max-w-60 overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="overflow-hidden aspect-video bg-zinc-800">
                {iconSrc ? (
                    <img
                        src={iconSrc}
                        alt={instance.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="font-semibold text-zinc-200 tracking-tight truncate">{instance.name}</p>
                <p className="text-[10px] font-medium text-zinc-500">{formattedDate}</p>
            </div>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-8">
            <p className="text-zinc-400">{t("home.noClients")}</p>
            <p className="text-sm text-zinc-500 mt-1">{t("home.addClientHint")}</p>
        </div>
    );
}
