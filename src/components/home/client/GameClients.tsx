import { useHomeStore } from "@/components/home/HomeStore";
import AddGameClientDialog from "@/components/home/client/AddGameClientDialog";
import ClientRow from "@/components/home/client/ClientRow";
import { t } from "@/lib/i18n";

export default function GameClients() {
    const gameClients = useHomeStore((s) => s.gameClients);
    const gameInstances = useHomeStore((s) => s.gameInstances);
    const worlds = useHomeStore((s) => s.worlds);

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200 px-8">{t("home.gameClients")}</h2>
            <div className="p-8 mx-2 rounded-2xl bg-editor/40 backdrop-blur-sm relative z-50 border border-zinc-800/50">
                <div className="overflow-hidden space-y-6">
                    {gameClients.map((client, index) => (
                        <ClientRow key={client.id} client={client} instances={gameInstances.filter((i) => i.clientId === client.id)} worlds={worlds} showDivider={index < gameClients.length - 1} />
                    ))}

                    {gameClients.length === 0 && (
                        <div className="text-center py-6">
                            <p className="text-zinc-400">{t("home.noClients")}</p>
                            <p className="text-sm text-zinc-500 mt-1">{t("home.addClientHint")}</p>
                        </div>
                    )}
                </div>

                {gameClients.length > 0 && (
                    <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent my-6" />
                )}

                <AddGameClientDialog />
            </div>
        </section>
    );
}