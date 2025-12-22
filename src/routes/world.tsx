import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { useState } from "react";
import { useHomeStore } from "@/components/home/HomeStore";
import { ContentCard } from "@/components/home/sections/ContentCard";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import { useConfiguratorStore } from "@/components/tools/Store";
import { SegmentedControl, SegmentedItem } from "@/components/ui/SegmentedControl";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";
import { loadDatapackFromPath } from "@/lib/utils/datapack";
import { convertIconToSrc, scanInstanceContent, scanInstanceWorlds, type PackContent, type WorldInfo } from "@/lib/utils/instance";

export const Route = createFileRoute("/world")({
    component: WorldPage,
    validateSearch: (search: Record<string, unknown>): { instanceId?: string } => ({
        instanceId: typeof search.instanceId === "string" ? search.instanceId : undefined
    })
});

type TabType = "world" | "mods" | "resourcepacks";
interface InstanceContentState {
    worlds: WorldInfo[];
    mods: PackContent[];
    globalDatapacks: PackContent[];
    resourcePacks: PackContent[];
    loading: boolean;
}

function WorldPage() {
    const { instanceId } = Route.useSearch();
    const navigate = useNavigate();
    const instance = useHomeStore((s) => s.gameInstances.find((i) => i.id === instanceId));
    const [tab, setTab] = useState<TabType>("world");
    const [expandedWorldId, setExpandedWorldId] = useState<string | null>(null);
    const [content, setContent] = useState<InstanceContentState>({
        worlds: [],
        mods: [],
        globalDatapacks: [],
        resourcePacks: [],
        loading: true
    });

    const loadContent = async () => {
        if (!instance) return;
        const [worlds, mods, globalDatapacks, resourcePacks] = await Promise.all([
            scanInstanceWorlds(instance.path),
            scanInstanceContent(instance.path, "mods"),
            scanInstanceContent(instance.path, "datapacks"),
            scanInstanceContent(instance.path, "resourcepacks")
        ]);

        setContent({ worlds, mods, globalDatapacks, resourcePacks, loading: false });
    };

    if (content.loading && instance) {
        loadContent();
    }

    const handleConfigure = async (pack: PackContent) => {
        try {
            const { datapack, name, isModded } = await loadDatapackFromPath(pack.path);
            useConfiguratorStore.getState().setup(datapack, isModded, name);
            useHomeStore.getState().addRecentProject({
                name,
                path: pack.path,
                type: pack.type
            });
            toast(t("studio.success.loaded", { file: name }), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("studio.error.failed_to_upload");
            toast(t("generic.dialog.error"), TOAST.ERROR, errorMessage);
        }
    };

    const toggleWorldExpand = (worldId: string) => {
        setExpandedWorldId(expandedWorldId === worldId ? null : worldId);
    };

    if (!instance) {
        return (
            <div className="size-full flex items-center justify-center">
                <p className="text-zinc-400">Instance not found</p>
            </div>
        );
    }

    const firstWorld = content.worlds[0];
    const backgroundSrc = firstWorld ? convertIconToSrc(firstWorld.iconPath) : undefined;
    const iconSrc = convertIconToSrc(instance.iconPath) ?? backgroundSrc;

    return (
        <div className="size-full flex relative">
            <Background />

            {backgroundSrc && <img src={backgroundSrc} alt={instance.name} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm pointer-events-none" />}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none" />

            <main className="relative z-10 flex-1 flex flex-col min-w-0">
                <header className="relative shrink-0 h-40 w-full flex flex-col justify-end px-12 pb-8">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="size-24 rounded-2xl border-2 border-white/10 p-1 bg-zinc-900/50 backdrop-blur-md shadow-2xl">
                                {iconSrc ? (
                                    <img src={iconSrc} alt={instance.name} className="size-full object-cover rounded-xl" />
                                ) : (
                                    <div className="size-full rounded-xl bg-zinc-800 flex items-center justify-center">
                                        <svg className="size-8 text-zinc-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-bold tracking-tighter text-white">{instance.name}</h1>
                                <p className="text-zinc-400 font-medium flex items-center gap-2">
                                    <span>{content.worlds.length} worlds</span>
                                    <span className="size-1 rounded-full bg-zinc-700" />
                                    <span>{content.mods.length} mods</span>
                                    <span className="size-1 rounded-full bg-zinc-700" />
                                    <span>{content.resourcePacks.length} resource packs</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => revealItemInDir(instance.path)}
                                className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md text-zinc-400 hover:text-white transition-all"
                                title="Open in explorer">
                                <img src="/icons/dots-vertical.svg" alt="Options" className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate({ to: "/" })}
                                className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md text-zinc-400 hover:text-white transition-all">
                                <img src="/icons/arrow-left.svg" alt="Go back" className="size-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="px-8 py-4">
                    <SegmentedControl value={tab} onChange={(v) => setTab(v as TabType)}>
                        <SegmentedItem value="world">Worlds ({content.worlds.length})</SegmentedItem>
                        <SegmentedItem value="mods">Mods & Packs ({content.mods.length + content.globalDatapacks.length})</SegmentedItem>
                        <SegmentedItem value="resourcepacks">Resource Packs ({content.resourcePacks.length})</SegmentedItem>
                    </SegmentedControl>
                </div>

                <div className="relative flex-1 overflow-y-auto px-8 pb-12 pt-2 flex flex-col gap-2 mask-[linear-gradient(to_bottom,transparent,black_24px)]">
                    {content.loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-zinc-500">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {tab === "world" &&
                                content.worlds.map((world) => (
                                    <div key={world.id} className="flex flex-col gap-1">
                                        <ContentCard title={world.name} iconSrc={convertIconToSrc(world.iconPath)} subtitle={`${world.datapacks.length} datapacks`} type="World" path={world.path} expanded={expandedWorldId === world.id} onExpand={() => toggleWorldExpand(world.id)} expandable={world.datapacks.length > 0} />
                                        {expandedWorldId === world.id &&
                                            world.datapacks.map((dp) => (
                                                <div key={dp.id} className="ml-8">
                                                    <ContentCard title={dp.name} iconSrc={convertIconToSrc(dp.iconPath)} type="Datapack" path={dp.path} showActions={false} onConfigure={() => handleConfigure(dp)} />
                                                </div>
                                            ))}
                                    </div>
                                ))}

                            {tab === "mods" && (
                                <>
                                    {content.mods.map((mod) => (
                                        <ContentCard key={mod.id} title={mod.name} iconSrc={convertIconToSrc(mod.iconPath)} type="Mod" path={mod.path} onConfigure={() => handleConfigure(mod)} />
                                    ))}
                                    {content.globalDatapacks.map((dp) => (
                                        <ContentCard key={dp.id} title={dp.name} iconSrc={convertIconToSrc(dp.iconPath)} type="Datapack" path={dp.path} onConfigure={() => handleConfigure(dp)} />
                                    ))}
                                    {content.mods.length === 0 && content.globalDatapacks.length === 0 && (
                                        <p className="text-zinc-500 text-center py-8">No mods or datapacks found</p>
                                    )}
                                </>
                            )}

                            {tab === "resourcepacks" && (
                                <>
                                    {content.resourcePacks.map((rp) => (
                                        <ContentCard key={rp.id} title={rp.name} iconSrc={convertIconToSrc(rp.iconPath)} type="Resource Pack" path={rp.path} onConfigure={() => handleConfigure(rp)} />
                                    ))}
                                    {content.resourcePacks.length === 0 && (
                                        <p className="text-zinc-500 text-center py-8">No resource packs found</p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>

            <NewsSidebar />
        </div>
    );
}
