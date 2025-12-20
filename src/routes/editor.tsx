import { getCurrentWindow } from "@tauri-apps/api/window";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import EditorLoading from "@/components/tools/loading/EditorLoading";
import ConfigManager from "@/components/tools/ConfigManager";
import StudioDialog from "@/components/tools/concept/home/StudioDialog";
import ItemTooltip from "@/components/tools/elements/gui/ItemTooltip";
import NotFoundStudio from "@/components/tools/NotFoundStudio";
import StudioSidebar from "@/components/tools/sidebar/Sidebar";
import Internalization from "@/components/tools/Internalization";
import { getQueryClient } from "@/lib/utils/query";

const appWindow = getCurrentWindow();

export const Route = createFileRoute("/editor")({
    component: EditorLayout,
    pendingComponent: EditorLoading,
    notFoundComponent: NotFoundStudio
});

function EditorLayout() {
    const queryClient = getQueryClient();

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-editor">
            <aside className="shrink-0 w-16 flex flex-col ">
                <div className="h-12 flex items-center justify-center">
                    <a href="/" className="hover:opacity-80 transition-opacity">
                        <img src="/icons/logo.svg" alt="Voxel" className="size-5" />
                    </a>
                </div>
                <StudioSidebar />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header
                    data-tauri-drag-region
                    className="shrink-0 h-12 flex items-center justify-between select-none">
                    <div className="flex items-center gap-4 pl-4">
                        <Internalization />
                    </div>

                    <div className="flex items-center h-full">
                        <button
                            type="button"
                            onClick={() => appWindow.minimize()}
                            className="h-full px-4 flex items-center justify-center group cursor-pointer">
                            <svg className="size-3 text-zinc-500 group-hover:text-zinc-200 transition-colors" viewBox="0 0 10 1">
                                <path fill="currentColor" d="M0 0h10v1H0z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => appWindow.toggleMaximize()}
                            className="h-full px-4 flex items-center justify-center group cursor-pointer">
                            <svg className="size-3 text-zinc-500 group-hover:text-zinc-200 transition-colors" viewBox="0 0 10 10">
                                <path fill="currentColor" d="M0 0v10h10V0H0zm1 1h8v8H1V1z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => appWindow.close()}
                            className="h-full px-4 flex items-center justify-center group cursor-pointer">
                            <svg className="size-3 text-zinc-500 group-hover:text-red-400 transition-colors" viewBox="0 0 10 10">
                                <path
                                    fill="currentColor"
                                    d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59 1.41 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 relative min-h-0 ml-0 bg-content overflow-hidden border-t border-zinc-800/50 rounded-tl-3xl">
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
        </div>
    );
}
