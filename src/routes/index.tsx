import { createFileRoute } from "@tanstack/react-router";
import HomeLayout from "@/components/home/layout/HomeLayout";
import QuickActions from "@/components/home/dashboard/QuickActions";
import ProjectList from "@/components/home/dashboard/ProjectList";
import VanillaExplorer from "@/components/home/dashboard/VanillaExplorer";
import StudioLoading from "@/components/tools/loading/StudioLoading";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/")({
    component: HomePage,
    pendingComponent: StudioLoading
});

function HomePage() {
    return (
        <HomeLayout>
            <div className="grid grid-cols-12 gap-8 h-full">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{t("studio.welcome")}</h1>
                        <p className="text-zinc-500">{t("studio.welcome.description")}</p>
                    </div>

                    <QuickActions />

                    <div className="h-px bg-linear-to-r from-transparent via-zinc-800/50 to-transparent" />

                    <ProjectList />
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-[400px]">
                    <VanillaExplorer />

                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{t("studio.update")}</span>
                        </div>
                        <p className="text-sm text-zinc-400">{t("studio.update.description")}</p>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
