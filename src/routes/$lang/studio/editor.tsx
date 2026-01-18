import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import ConfigManager from "@/components/tools/ConfigManager";
import StudioDialog from "@/components/tools/concept/StudioDialog";
import AppLayout from "@/components/tools/EditorLayout";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import { FloatingBarProvider } from "@/components/tools/floatingbar/FloatingBarContext";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import { getQueryClient } from "@/lib/utils/query";

export const Route = createFileRoute("/$lang/studio/editor")({
    component: EditorLayout,
    notFoundComponent: NotFoundStudio
});

function EditorLayout() {
    const queryClient = getQueryClient();

    return (
        <div className="flex relative h-dvh">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AppLayout>
                    <FloatingBarProvider>
                        <ConfigManager>
                            <Outlet />
                            <ItemTooltip />
                            <StudioDialog />
                        </ConfigManager>
                    </FloatingBarProvider>
                </AppLayout>
            </HydrationBoundary>
        </div>
    );
}
