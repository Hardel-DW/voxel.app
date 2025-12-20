import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import EditorLoading from "@/components/tools/loading/EditorLoading";
import ConfigManager from "@/components/tools/ConfigManager";
import StudioDialog from "@/components/tools/concept/home/StudioDialog";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import StudioSidebar from "@/components/tools/sidebar/Sidebar";
import ToolInternalization from "@/components/tools/ToolInternalization";
import { useDataAttribute } from "@/lib/hook/useDataAttribute";
import { getQueryClient } from "@/lib/utils/query";

export const Route = createFileRoute("/editor")({
    component: EditorLayout,
    pendingComponent: EditorLoading,
    notFoundComponent: NotFoundStudio
});

function EditorLayout() {
    const queryClient = getQueryClient();
    const pinned = useDataAttribute<HTMLDivElement>({ name: "pinned", initial: true });

    return (
        <div
            className="flex gap-4 h-dvh w-full p-4 overflow-hidden relative transition-all duration-300 ease-in-out box-border"
            ref={pinned.ref}>
            <div className="shrink-0 transition-[width] duration-300 ease-in-out z-40 w-20 in-data-pinned:w-70 border in-data-pinned:border-none not-in-data-pinned:rounded-2xl not-in-data-pinned:border-zinc-800/50 not-in-data-pinned:bg-zinc-950/75">
                <aside className="flex flex-col h-full w-full overflow-hidden rounded-2xl border-none">
                    <div className="flex items-center shrink-0 in-data-pinned:pt-5 transition-all duration-300 justify-center in-data-pinned:justify-between flex-col gap-4 in-data-pinned:flex-row in-data-pinned:gap-0 in-data-pinned:px-6">
                        <a
                            href="/"
                            className="flex items-center gap-2 text-lg transition-colors hover:opacity-80 w-0 opacity-0 in-data-pinned:w-auto in-data-pinned:opacity-100 not-in-data-pinned:h-0">
                            <img src="/icons/logo.svg" alt="Voxel" className="size-6 brightness-90" />
                            <span className="font-bold text-primary transition-all duration-300 overflow-hidden">VOXEL</span>
                        </a>
                        <button
                            type="button"
                            onClick={pinned.toggle}
                            className="size-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-100">
                            <img src="/icons/menu.svg" alt="Collapse" className="size-6 invert-75" />
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 px-2">
                        <StudioSidebar />
                    </div>
                </aside>
            </div>

            <main className="flex-1 relative flex flex-col min-w-0 bg-content overflow-hidden rounded-2xl border border-zinc-900">
                <div className="absolute top-6 right-8 z-50 flex items-center gap-6 pointer-events-auto">
                    <ToolInternalization />
                    <a href="/" className="select-none size-fit opacity-50 hover:opacity-100 transition-opacity">
                        <img src="/icons/logo.svg" alt="Voxel" className="size-6" />
                    </a>
                </div>

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
        </div>
    );
}
