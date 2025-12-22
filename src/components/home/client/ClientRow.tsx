import { useState } from "react";
import GameCard from "@/components/home/client/GameCard";
import type { GameClient } from "@/components/home/HomeStore";
import { t } from "@/lib/i18n";
import { type InstanceInfo, scanLauncherInstances, scanWorlds, type WorldInfo } from "@/lib/utils/instance";

interface CardItem {
    data: InstanceInfo | WorldInfo;
    instancePath?: string;
}

const scanClientContent = async (client: GameClient): Promise<CardItem[]> => {
    if (client.type === "vanilla") {
        const { items } = await scanWorlds(client.path);
        return items.map((data) => ({ data, instancePath: client.path }));
    }

    const instances = await scanLauncherInstances(client.type, client.path);
    return instances.map((data) => ({ data }));
};

export default function ClientRow({ client, showDivider }: { client: GameClient; showDivider: boolean }) {
    const [items, setItems] = useState<CardItem[] | null>(null);
    if (items === null) scanClientContent(client).then(setItems);
    const isVanilla = client.type === "vanilla";
    const emptyLabel = isVanilla ? t("home.noWorlds") : t("home.noInstances");

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <img src={client.icon} alt={client.name} className="size-5" />
                    <h3 className="text-base font-semibold text-zinc-200">{client.name}</h3>
                    {items && <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{items.length}</span>}
                </div>

                {items === null ? (
                    <p className="text-sm text-zinc-500">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-zinc-500">{emptyLabel}</p>
                ) : (
                    <div className="flex gap-3 -mx-8 px-8 overflow-x-auto pb-2">
                        {items.map(({ data, instancePath }) => (
                            <GameCard key={data.path} data={data} instancePath={instancePath} />
                        ))}
                    </div>
                )}
            </div>
            {showDivider && <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />}
        </>
    );
}
