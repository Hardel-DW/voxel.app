import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTranslate } from "@/lib/i18n";

const appWindow = getCurrentWindow();

export default function TitleBar() {
    const t = useTranslate();

    return (
        <div className="fixed top-0 left-0 right-0 flex flex-col select-none z-1000">
            <div data-tauri-drag-region className="h-8 flex items-center justify-between">
                <div className="flex items-center gap-2 pl-3 pointer-events-none">
                    <img src="/icons/logo.svg" alt="Voxel" className="size-4" />
                    <span className="text-xs font-medium text-zinc-400">{t("tauri:app.title")}</span>
                </div>

                <div className="flex items-center h-full">
                    <button
                        type="button"
                        onClick={() => appWindow.minimize()}
                        className="h-full px-3 flex items-center justify-center group cursor-pointer">
                        <svg className="size-3 text-zinc-500 group-hover:text-zinc-200 transition-colors" viewBox="0 0 10 1">
                            <path fill="currentColor" d="M0 0h10v1H0z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => appWindow.toggleMaximize()}
                        className="h-full px-3 flex items-center justify-center group cursor-pointer">
                        <svg className="size-3 text-zinc-500 group-hover:text-zinc-200 transition-colors" viewBox="0 0 10 10">
                            <path fill="currentColor" d="M0 0v10h10V0H0zm1 1h8v8H1V1z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={() => appWindow.close()}
                        className="h-full px-3 flex items-center justify-center group cursor-pointer">
                        <svg className="size-3 text-zinc-500 group-hover:text-red-400 transition-colors" viewBox="0 0 10 10">
                            <path
                                fill="currentColor"
                                d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59 1.41 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="h-px opacity-25 w-full bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
        </div>
    );
}
