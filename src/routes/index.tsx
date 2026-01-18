import { createFileRoute } from "@tanstack/react-router";
import GameClients from "@/components/home/client/GameClients";
import { useHomeStore } from "@/lib/store/HomeStore";
import RecentProjects from "@/components/home/sections/RecentProjects";
import Background from "@/components/layout/Background";
import NewsSidebar from "@/components/layout/news/NewsSidebar";
import StudioLoading from "@/components/tools/loading/StudioLoading";
import { TextInput } from "@/components/ui/TextInput";
import { getGreeting } from "@/lib/getGreeting";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/")({
    component: HomePage,
    pendingComponent: StudioLoading
});

function HomePage() {
    const projectCount = useHomeStore((s) => s.recentProjects.length);

    return (
        <div className="size-full flex">
            <Background />
            <div className="flex-1 overflow-y-auto">
                <div className="w-full pt-8 pb-2 space-y-10">
                    <div className="flex items-start justify-between px-8">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-white tracking-tight">{getGreeting()}</h1>
                            <p className="text-sm text-zinc-500">
                                {projectCount > 0 ? t("tauri:home.subtitle.projects", { count: projectCount }) : t("tauri:home.subtitle.empty")}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <TextInput placeholder="Search projects..." className="min-w-64 backdrop-blur-xs relative z-50" />
                        </div>
                    </div>
                    <RecentProjects />
                    <GameClients />
                </div>
            </div>

            <NewsSidebar />
        </div>
    );
}
