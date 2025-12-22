import GameCard from "@/components/home/client/GameCard";
import type { GameClient, GameInstance, WorldData } from "@/components/home/HomeStore";
import { t } from "@/lib/i18n";

export default function ClientRow(props: { client: GameClient; instances: GameInstance[]; worlds: WorldData[]; showDivider: boolean }) {
    const { client, instances, worlds, showDivider } = props;
    const isVanilla = client.type === "vanilla";
    const vanillaInstance = isVanilla ? instances[0] : null;
    const vanillaWorlds = vanillaInstance ? worlds.filter((w) => w.instanceId === vanillaInstance.id) : [];
    const items = isVanilla ? vanillaWorlds : instances;
    const itemCount = items.length;
    const hasNoItems = itemCount === 0;

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <img src={client.icon} alt={client.name} className="size-5" />
                    <h3 className="text-base font-semibold text-zinc-200">{client.name}</h3>
                    <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{itemCount}</span>
                </div>

                {hasNoItems ? (
                    <p className="text-sm text-zinc-500">{t("home.noInstances")}</p>
                ) : (
                    <div className="flex gap-3 -mx-8 px-8 overflow-x-auto pb-2">
                        {isVanilla
                            ? vanillaWorlds.map((world) => <GameCard key={world.id} type="world" world={world} />)
                            : instances.map((instance) => {
                                  const firstWorld = worlds
                                      .filter((w) => w.instanceId === instance.id)
                                      .toSorted((a, b) => b.lastPlayed - a.lastPlayed)[0];
                                  return <GameCard key={instance.id} type="instance" instance={instance} firstWorld={firstWorld} />;
                              })}
                    </div>
                )}
            </div>

            {showDivider && <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />}
        </>
    );
}
