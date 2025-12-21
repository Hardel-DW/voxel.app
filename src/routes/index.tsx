import { createFileRoute } from "@tanstack/react-router";
import CreateProject from "@/components/home/sections/CreateProject";
import GameClients from "@/components/home/sections/GameClients";
import NewsSidebar from "@/components/home/sections/NewsSidebar";
import RecentProjects from "@/components/home/sections/RecentProjects";
import StudioLoading from "@/components/tools/loading/StudioLoading";
import { useHomeStore } from "@/components/home/HomeStore";
import { getGreeting } from "@/lib/getGreeting";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/")({
    component: HomePage,
    pendingComponent: StudioLoading
});

function HomePage() {
    const projectCount = useHomeStore((s) => s.recentProjects.length);

    return (
        <div className="size-full flex overflow-hidden relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="w-full p-8 space-y-10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">{getGreeting()}</h1>
                            <p className="text-sm text-zinc-500">
                                {projectCount > 0
                                    ? t("home.subtitle.projects", { count: projectCount })
                                    : t("home.subtitle.empty")}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-medium text-emerald-400">{t("home.status.ready")}</span>
                            </div>
                        </div>
                    </div>
                    <RecentProjects />

                    <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />

                    <GameClients />

                    <div className="h-px bg-linear-to-r from-transparent via-zinc-700/30 to-transparent" />

                    <CreateProject />

                    <div className="h-20" />
                </div>
            </div>

            <div className="hidden xl:block border-l border-zinc-800/30 bg-zinc-950/30">
                <div className="p-6 h-full overflow-y-auto">
                    <NewsSidebar />
                </div>
            </div>
        </div>
    );
}
