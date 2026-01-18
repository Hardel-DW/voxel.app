import { Link, useLocation } from "@tanstack/react-router";
import { getCurrentWindow } from "@tauri-apps/api/window";
import HomeSidebar from "@/components/home/HomeSidebar";
import EditorTabs from "@/components/tools/EditorTabs";
import StudioSidebar from "@/components/tools/sidebar/Sidebar";

const appWindow = getCurrentWindow();

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isHome = !location.pathname.startsWith("/editor");

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-editor">
            <aside className="shrink-0 w-16 flex flex-col">
                <div className="h-16 flex items-center justify-center">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <img src="/icons/logo.svg" alt="Voxel" className="size-5" />
                    </Link>
                </div>
                {isHome ? <HomeSidebar /> : <StudioSidebar />}
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header data-tauri-drag-region className="shrink-0 h-12 flex items-center justify-between select-none">
                    <div className="flex items-center gap-4 pl-4">
                        {!isHome && <EditorTabs />}
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
                <main className="flex-1 relative min-h-0 h-full ml-0 bg-content overflow-hidden border-t border-l border-zinc-950 rounded-tl-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
