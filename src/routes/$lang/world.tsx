import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ContentCard } from "@/components/home/sections/ContentCard";
import Header from "@/components/home/world/header";
import WorldRow from "@/components/home/world/WorldRow";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination from "@/components/ui/Pagination";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/Tabs";
import { openDatapackFromPath } from "@/lib/store/ProjectStore";
import { useContentCountsQuery, useContentQuery, useDatapacksQuery, useModsAndDatapacksQuery, useWorldsQuery } from "@/lib/utils/instance";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";
import type { PackContent } from "@/lib/utils/instance/types";
import { PAGE_SIZE } from "@/lib/utils/instance/worlds";

type TabType = "worlds" | "mods" | "resourcepacks";

export const Route = createFileRoute("/$lang/world")({
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
    const [worldsPage, setWorldsPage] = useState(0);
    const [modsPage, setModsPage] = useState(0);
    const [resourcepacksPage, setResourcepacksPage] = useState(0);
    const [expandedWorld, setExpandedWorld] = useState<string | null>(null);
    const [datapacksPage, setDatapacksPage] = useState(0);
    const counts = useContentCountsQuery(path);
    const worlds = useWorldsQuery(path, worldsPage);
    const mods = useModsAndDatapacksQuery(path, modsPage);
    const resourcepacks = useContentQuery(path, "resourcepacks", resourcepacksPage);
    const datapacks = useDatapacksQuery(expandedWorld, datapacksPage);
    if (!path) return <div className="size-full flex items-center justify-center text-zinc-500">No instance selected</div>;

    const handleTabChange = (t: string) => setTab(t as TabType);
    const handleWorldExpand = (worldPath: string) => {
        const isExpanding = expandedWorld !== worldPath;
        setExpandedWorld(isExpanding ? worldPath : null);
        if (isExpanding) setDatapacksPage(0);
    };

    const handleOpenDatapack = (pack: PackContent) => {
        openDatapackFromPath(pack.path, () => navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } }));
    };

    const firstWorldIcon = worlds.data?.items[0]?.iconPath ?? null;
    const backgroundSrc = convertIconToSrc(firstWorldIcon);
    const currentTotal =
        tab === "worlds" ? (worlds.data?.total ?? 0) : tab === "mods" ? (mods.data?.total ?? 0) : (resourcepacks.data?.total ?? 0);

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
                <Header
                    name={name}
                    path={path}
                    total={currentTotal}
                    iconSrc={backgroundSrc}
                    onBack={() => navigate({ to: "/$lang", params: { lang } })}
                />
                <Tabs defaultValue={tab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0 px-8 gap-4">
                    <TabsTrigger value="worlds">Worlds ({counts.data?.worlds ?? worlds.data?.total ?? 0})</TabsTrigger>
                    <TabsTrigger value="mods">
                        Mods & Packs ({counts.data ? counts.data.mods + counts.data.datapacks : (mods.data?.total ?? 0)})
                    </TabsTrigger>
                    <TabsTrigger value="resourcepacks">
                        Resources ({counts.data?.resourcepacks ?? resourcepacks.data?.total ?? 0})
                    </TabsTrigger>

                    <TabsContent value="worlds" className="flex-1 overflow-y-auto pb-8 flex flex-col gap-2">
                        <AsyncContent loading={worlds.isLoading} empty={worlds.data?.items.length === 0}>
                            <div className="worlds-list flex flex-col gap-2">
                                {worlds.data?.items.map((world) => (
                                    <WorldRow
                                        key={world.path}
                                        world={world}
                                        expanded={expandedWorld === world.path}
                                        datapacks={datapacks.data}
                                        datapacksLoading={datapacks.isLoading}
                                        datapacksPage={datapacksPage}
                                        onExpand={() => handleWorldExpand(world.path)}
                                        onConfigure={handleOpenDatapack}
                                        onDatapacksPageChange={setDatapacksPage}
                                    />
                                ))}
                            </div>
                            <Pagination
                                page={worldsPage}
                                total={worlds.data?.total ?? 0}
                                pageSize={PAGE_SIZE}
                                loading={worlds.isFetching}
                                onPageChange={setWorldsPage}
                            />
                        </AsyncContent>
                    </TabsContent>

                    <TabsContent value="mods" className="flex-1 overflow-y-auto pb-8 flex flex-col gap-2">
                        <AsyncContent loading={mods.isLoading} empty={mods.data?.items.length === 0}>
                            {mods.data?.items.map((pack) => (
                                <ContentCard
                                    key={pack.path}
                                    title={pack.name}
                                    iconSrc={convertIconToSrc(pack.iconPath)}
                                    type={pack.type === "mods" ? "Mod" : "Datapack"}
                                    path={pack.path}
                                    onConfigure={() => handleOpenDatapack(pack)}
                                />
                            ))}
                            <Pagination
                                page={modsPage}
                                total={mods.data?.total ?? 0}
                                pageSize={PAGE_SIZE}
                                loading={mods.isFetching}
                                onPageChange={setModsPage}
                            />
                        </AsyncContent>
                    </TabsContent>

                    <TabsContent value="resourcepacks" className="flex-1 overflow-y-auto pb-8 flex flex-col gap-2">
                        <AsyncContent loading={resourcepacks.isLoading} empty={resourcepacks.data?.items.length === 0}>
                            {resourcepacks.data?.items.map((rp) => (
                                <ContentCard
                                    key={rp.path}
                                    title={rp.name}
                                    iconSrc={convertIconToSrc(rp.iconPath)}
                                    type="Resource Pack"
                                    path={rp.path}
                                    onConfigure={() => handleOpenDatapack(rp)}
                                />
                            ))}
                            <Pagination
                                page={resourcepacksPage}
                                total={resourcepacks.data?.total ?? 0}
                                pageSize={PAGE_SIZE}
                                loading={resourcepacks.isFetching}
                                onPageChange={setResourcepacksPage}
                            />
                        </AsyncContent>
                    </TabsContent>
                </Tabs>
            </main>
            <NewsSidebar />
        </div>
    );
}
