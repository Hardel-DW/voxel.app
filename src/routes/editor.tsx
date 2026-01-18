import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ConfigManager from "@/components/tools/ConfigManager";
import StudioDialog from "@/components/tools/concept/home/StudioDialog";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { useSaveShortcut } from "@/lib/hook/useSaveShortcut";
import { getQueryClient } from "@/lib/utils/query";

export const Route = createFileRoute("/editor")({
    component: EditorLayout,
    notFoundComponent: NotFoundStudio
});

function EditorLayout() {
    const queryClient = getQueryClient();
    useSaveShortcut();

    return (
        <main className="flex-1 relative min-h-0 ml-0 bg-content overflow-hidden border-t border-zinc-800/50 rounded-tl-3xl h-full">
            <div className="size-full relative">
                <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-3xl" />
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ConfigManager>
                        <Outlet />
                        <ItemTooltip />
                        <StudioDialog />
                    </ConfigManager>
                </HydrationBoundary>
            </div>
        </main>
    );
}
