import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContentCard } from "@/components/home/sections/ContentCard";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import { SegmentedControl, SegmentedItem } from "@/components/ui/SegmentedControl";

interface WorldSearchParams {
    instanceId?: string;
}

export const Route = createFileRoute("/world")({
    component: WorldPage,
    validateSearch: (search: Record<string, unknown>): WorldSearchParams => ({
        instanceId: typeof search.instanceId === "string" ? search.instanceId : undefined
    })
});

function WorldPage() {
    const [tab, setTab] = useState("world");

    return (
        <div className="size-full flex relative">
            <Background />

            {/* World background image */}
            <img
                src="/images/addons/card/dnt/toxic_lair.webp"
                alt="Toxic Lair"
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm pointer-events-none"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent pointer-events-none" />

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col min-w-0">
                <header className="relative shrink-0 h-40 w-full flex flex-col justify-end px-12 pb-8">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="size-24 rounded-2xl border-2 border-white/10 p-1 bg-zinc-900/50 backdrop-blur-md shadow-2xl">
                                <img
                                    src="/images/addons/card/dnt/toxic_lair.webp"
                                    alt="Toxic Lair"
                                    className="size-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-bold tracking-tighter text-white">Survival Hardcore V2</h1>
                                    <span className="px-2 py-0.5 rounded-md bg-modrinth/20 text-modrinth text-xs font-bold border border-modrinth/30">
                                        RUNNING
                                    </span>
                                </div>
                                <p className="text-zinc-400 font-medium flex items-center gap-2">
                                    <span>Minecraft 1.21.1</span>
                                    <span className="size-1 rounded-full bg-zinc-700" />
                                    <span>Fabric Loader</span>
                                    <span className="size-1 rounded-full bg-zinc-700" />
                                    <span>Last played 2h ago</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                                Play Instance
                            </button>
                            <button
                                type="button"
                                className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md text-zinc-400 hover:text-white transition-all">
                                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="px-8 py-4">
                    <SegmentedControl value={tab} onChange={setTab}>
                        <SegmentedItem value="world">World</SegmentedItem>
                        <SegmentedItem value="mods">Mods and Pack</SegmentedItem>
                        <SegmentedItem value="datapack">Resources Pack</SegmentedItem>
                    </SegmentedControl>
                </div>

                <div className="relative flex-1 overflow-y-auto px-8 pb-12 pt-2 flex flex-col gap-2 mask-[linear-gradient(to_bottom,transparent,black_24px)]">
                    {Array.from({ length: 50 }).map((_, index) => (
                        <ContentCard
                            key={`${index.toString()}-content-card`}
                            title="Content Card"
                            author="Author"
                            version="1.0.0"
                            type="Datapack"
                        />
                    ))}
                </div>
            </main>

            <NewsSidebar />
        </div>
    );
}
