import { useState } from "react";
import GameCard from "@/components/home/client/GameCard";
import { useTranslate } from "@/lib/i18n";
import type { GameClient } from "@/lib/store/HomeStore";
import { useCacheValue } from "@/lib/utils/cache";
import { instanceCache, syncClient } from "@/lib/utils/instance/cache";

const SYNC_COOLDOWN = 5000;

export default function ClientRow({ client, showDivider }: { client: GameClient; showDivider: boolean }) {
    const t = useTranslate();
    const { data, syncing } = { data: useCacheValue(instanceCache, client.path), syncing: instanceCache.isSyncing(client.path) };
    const [lastSync, setLastSync] = useState(0);

    if (!data && !syncing) syncClient(client.path, client.type);

    const canSync = Date.now() - lastSync > SYNC_COOLDOWN;
    const handleSync = () => {
        if (!canSync || syncing) return;
        setLastSync(Date.now());
        syncClient(client.path, client.type, true);
    };

    const isVanilla = client.type === "vanilla";
    const emptyLabel = isVanilla ? t("tauri:home.noWorlds") : t("tauri:home.noInstances");
    const items = data ?? [];

    return (
        <>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <img src={client.icon} alt={client.name} className="size-5" />
                    <h3 className="text-base font-semibold text-zinc-200">{client.name}</h3>
                    {data && <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-md">{items.length}</span>}
                    <button
                        type="button"
                        onClick={handleSync}
                        disabled={!canSync || syncing}
                        className="p-1 rounded hover:bg-zinc-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title={t("tauri:home.sync")}>
                        <svg
                            className={`size-4 text-zinc-400 ${syncing ? "animate-spin" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>

                {!data ? (
                    <p className="text-sm text-zinc-500">{t("tauri:home.loading")}</p>
                ) : items.length === 0 ? (
                    <p className="text-sm text-zinc-500">{emptyLabel}</p>
                ) : (
                    <div className="flex gap-3 -mx-8 px-8 overflow-x-auto pb-2">
                        {items.map((item) => (
                            <GameCard key={item.path} data={item} instancePath={isVanilla ? client.path : undefined} />
                        ))}
                    </div>
                )}
            </div>
            {showDivider && <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />}
        </>
    );
}
