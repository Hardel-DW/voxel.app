import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ContentCard } from "@/components/home/sections/ContentCard";
import Header from "@/components/home/world/header";
import WorldRow from "@/components/home/world/WorldRow";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination, { usePaginatedLoader } from "@/components/ui/Pagination";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/Tabs";
import { openDatapackFromPath } from "@/lib/store/ProjectStore";
import { useCacheValue } from "@/lib/utils/cache";
import { countsCache, syncCounts } from "@/lib/utils/instance/cache";
import { scanContent, scanDatapacks } from "@/lib/utils/instance/content";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";
import type { PackContent, WorldInfo } from "@/lib/utils/instance/types";
import { PAGE_SIZE, scanWorlds } from "@/lib/utils/instance/worlds";

type TabType = "worlds" | "mods" | "resourcepacks";
export const Route = createFileRoute("/world")({
    component: WorldPage,
    validateSearch: (search: Record<string, unknown>) => ({
        path: typeof search.path === "string" ? search.path : undefined,
        name: typeof search.name === "string" ? search.name : "Instance"
    })
});

function WorldPage() {
    const { path, name } = Route.useSearch();
    const navigate = useNavigate();
    const { lang } = useParams({ from: "/$lang" });
    const [tab, setTab] = useState<TabType>("worlds");
    const [expandedWorld, setExpandedWorld] = useState<string | null>(null);
    const cachedCounts = useCacheValue(countsCache, path);
    if (path && !cachedCounts) syncCounts(path);

    const worlds = usePaginatedLoader<WorldInfo>((page) => {
        if (!path) return Promise.resolve({ items: [], total: 0, hasMore: false });
        return scanWorlds(path, page);
    });

    const mods = usePaginatedLoader<PackContent>(async (page) => {
        if (!path) return { items: [], total: 0, hasMore: false };
        const [m, d] = await Promise.all([scanContent(path, "mods", page), scanContent(path, "datapacks", page)]);
        return { items: [...m.items, ...d.items], total: m.total + d.total, hasMore: m.hasMore || d.hasMore };
    });

    const resourcepacks = usePaginatedLoader<PackContent>((page) => {
        if (!path) return Promise.resolve({ items: [], total: 0, hasMore: false });
        return scanContent(path, "resourcepacks", page);
    });

    const datapacks = usePaginatedLoader<PackContent, string>((page, worldPath) => {
        if (!worldPath) return Promise.resolve({ items: [], total: 0, hasMore: false });
        return scanDatapacks(worldPath, page);
    });

    const tabs = { worlds, mods, resourcepacks } as const;
    const current = tabs[tab];
    if (!path) throw new Error("No instance selected");

    const handleTabChange = (t: string) => {
        const newTab = t as TabType;
        setTab(newTab);
        if (tabs[newTab].total === 0 && !tabs[newTab].loading) tabs[newTab].load();
    };

    const handleWorldExpand = (worldPath: string) => {
        const isExpanding = expandedWorld !== worldPath;
        setExpandedWorld(isExpanding ? worldPath : null);
        if (isExpanding) {
            datapacks.reset();
            datapacks.load(0, worldPath);
        }
    };

    if (worlds.total === 0 && !worlds.loading) worlds.load();
    const firstWorldIcon = worlds.items[0]?.iconPath;
    const backgroundSrc = convertIconToSrc(firstWorldIcon);
    const handleOpenDatapack = (pack: PackContent) =>
        openDatapackFromPath(pack.path, () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } }));

    return (
        <div className="size-full flex relative">
            <Background />
            {backgroundSrc && (
                <img
                    src={backgroundSrc}
                    alt="World background"
                    className="absolute inset-0 size-full object-cover opacity-40 blur-sm pointer-events-none"
                />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none" />

            <main className="relative z-10 flex-1 flex flex-col min-w-0">
                <Header name={name} path={path} total={current.total} iconSrc={backgroundSrc} onBack={() => navigate({ to: "/$lang", params: { lang } })} />
                <Tabs value={tab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
                    <TabsTrigger value="worlds">Worlds ({cachedCounts?.worlds ?? worlds.total})</TabsTrigger>
                    <TabsTrigger value="mods">Mods & Packs ({cachedCounts ? cachedCounts.mods + cachedCounts.datapacks : mods.total})</TabsTrigger>
                    <TabsTrigger value="resourcepacks">Resources ({cachedCounts?.resourcepacks ?? resourcepacks.total})</TabsTrigger>

                    <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-2">
                        <AsyncContent loading={current.loading} empty={current.items.length === 0}>
                            <TabsContent value="worlds" className="worlds-list flex flex-col gap-2">
                                {worlds.items.map((world) => (
                                    <WorldRow
                                        key={world.path}
                                        world={world}
                                        expanded={expandedWorld === world.path}
                                        datapacks={datapacks}
                                        onExpand={() => handleWorldExpand(world.path)}
                                        onConfigure={handleOpenDatapack}
                                    />
                                ))}
                            </TabsContent>

                            <TabsContent value="mods" className="flex flex-col gap-2">
                                {mods.items.map((pack) => (
                                    <ContentCard
                                        key={pack.path}
                                        title={pack.name}
                                        iconSrc={convertIconToSrc(pack.iconPath)}
                                        type={pack.type === "mods" ? "Mod" : "Datapack"}
                                        path={pack.path}
                                        onConfigure={() => handleOpenDatapack(pack)}
                                    />
                                ))}
                            </TabsContent>

                            <TabsContent value="resourcepacks" className="flex flex-col gap-2">
                                {resourcepacks.items.map((rp) => (
                                    <ContentCard
                                        key={rp.path}
                                        title={rp.name}
                                        iconSrc={convertIconToSrc(rp.iconPath)}
                                        type="Resource Pack"
                                        path={rp.path}
                                        onConfigure={() => handleOpenDatapack(rp)}
                                    />
                                ))}
                            </TabsContent>

                            <Pagination
                                page={current.page}
                                total={current.total}
                                pageSize={PAGE_SIZE}
                                loading={current.loading}
                                onPageChange={(p) => current.load(p)}
                            />
                        </AsyncContent>
                    </div>
                </Tabs>
            </main>
            <NewsSidebar />
        </div>
    );
}
