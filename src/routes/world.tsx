import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useHomeStore } from "@/components/home/HomeStore";
import { ContentCard } from "@/components/home/sections/ContentCard";
import Header from "@/components/home/world/header";
import WorldRow from "@/components/home/world/WorldRow";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import { useConfiguratorStore } from "@/components/tools/Store";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination, { usePaginatedLoader } from "@/components/ui/Pagination";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/Tabs";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";
import { loadDatapackFromPath } from "@/lib/utils/datapack";
import type { PackContent, WorldInfo } from "@/lib/utils/instance";
import { convertIconToSrc, PAGE_SIZE, scanContent, scanDatapacks, scanWorlds } from "@/lib/utils/instance";

export const Route = createFileRoute("/world")({
    component: WorldPage,
    validateSearch: (search: Record<string, unknown>) => ({
        path: typeof search.path === "string" ? search.path : undefined,
        name: typeof search.name === "string" ? search.name : "Instance"
    })
});

type TabType = "worlds" | "mods" | "resourcepacks";

function WorldPage() {
    const { path, name } = Route.useSearch();
    const navigate = useNavigate();
    const [tab, setTab] = useState<TabType>("worlds");
    const [expandedWorld, setExpandedWorld] = useState<string | null>(null);

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

    const datapacks = usePaginatedLoader<PackContent>((page) => {
        if (!expandedWorld) return Promise.resolve({ items: [], total: 0, hasMore: false });
        return scanDatapacks(expandedWorld, page);
    });

    const tabs = { worlds, mods, resourcepacks } as const;
    const current = tabs[tab];
    if (!path)
        return (
            <div className="size-full flex items-center justify-center">
                <p className="text-zinc-400">No instance selected</p>
            </div>
        );

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
            datapacks.load();
        }
    };

    const handleConfigure = async (pack: PackContent) => {
        try {
            const { datapack, name: n, isModded } = await loadDatapackFromPath(pack.path);
            useConfiguratorStore.getState().setup(datapack, isModded, n);
            useHomeStore.getState().addRecentProject({ name: n, path: pack.path, type: pack.type });
            toast(t("studio.success.loaded", { file: n }), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            toast(t("generic.dialog.error"), TOAST.ERROR, e instanceof Error ? e.message : t("studio.error.failed_to_upload"));
        }
    };

    if (worlds.total === 0 && !worlds.loading) worlds.load();
    const firstWorldIcon = worlds.items[0]?.iconPath;
    const backgroundSrc = convertIconToSrc(firstWorldIcon);

    return (
        <div className="size-full flex relative">
            <Background />
            {backgroundSrc && (
                <img
                    src={backgroundSrc}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-40 blur-sm pointer-events-none"
                />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none" />

            <main className="relative z-10 flex-1 flex flex-col min-w-0">
                <Header name={name} path={path} total={current.total} iconSrc={backgroundSrc} onBack={() => navigate({ to: "/" })} />

                <Tabs value={tab} onChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
                    <div className="px-8 py-3">
                        <TabList>
                            <Tab value="worlds">Worlds ({worlds.total})</Tab>
                            <Tab value="mods">Mods & Packs ({mods.total})</Tab>
                            <Tab value="resourcepacks">Resources ({resourcepacks.total})</Tab>
                        </TabList>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-2">
                        <AsyncContent loading={current.loading} empty={current.items.length === 0}>
                            <TabPanel value="worlds" className="flex flex-col gap-2">
                                {worlds.items.map((world) => (
                                    <WorldRow
                                        key={world.path}
                                        world={world}
                                        expanded={expandedWorld === world.path}
                                        datapacks={datapacks}
                                        onExpand={() => handleWorldExpand(world.path)}
                                        onConfigure={handleConfigure}
                                    />
                                ))}
                            </TabPanel>

                            <TabPanel value="mods" className="flex flex-col gap-2">
                                {mods.items.map((pack) => (
                                    <ContentCard
                                        key={pack.path}
                                        title={pack.name}
                                        iconSrc={convertIconToSrc(pack.iconPath)}
                                        type={pack.type === "mods" ? "Mod" : "Datapack"}
                                        path={pack.path}
                                        onConfigure={() => handleConfigure(pack)}
                                    />
                                ))}
                            </TabPanel>

                            <TabPanel value="resourcepacks" className="flex flex-col gap-2">
                                {resourcepacks.items.map((rp) => (
                                    <ContentCard
                                        key={rp.path}
                                        title={rp.name}
                                        iconSrc={convertIconToSrc(rp.iconPath)}
                                        type="Resource Pack"
                                        path={rp.path}
                                        onConfigure={() => handleConfigure(rp)}
                                    />
                                ))}
                            </TabPanel>

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
