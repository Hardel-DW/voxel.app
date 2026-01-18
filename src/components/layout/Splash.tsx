import { t } from "@/lib/i18n";
import TitleBar from "./TitleBar";

const GridBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 squaring-zinc-800 opacity-20" />
        <div className="absolute inset-0 bg-radial-at-c from-zinc-900/50 via-black to-black" />
    </div>
);

export default function Splash() {
    return (
        <>
            <TitleBar />
            <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none z-50">
                <GridBackground />
                <div className="absolute top-12 left-6 bottom-6 right-6 border border-white/5 border-dashed z-10 flex flex-col justify-between p-4 opacity-100 transition-all duration-700 starting:opacity-0 starting:scale-95">
                    <div className="absolute -top-px -left-px size-4 border-t border-l border-white/40 opacity-100 transition-opacity duration-500 delay-300 starting:opacity-0" />
                    <div className="absolute -top-px -right-px size-4 border-t border-r border-white/40 opacity-100 transition-opacity duration-500 delay-400 starting:opacity-0" />
                    <div className="absolute -bottom-px -left-px size-4 border-b border-l border-white/40 opacity-100 transition-opacity duration-500 delay-500 starting:opacity-0" />
                    <div className="absolute -bottom-px -right-px size-4 border-b border-r border-white/40 opacity-100 transition-opacity duration-500 delay-600 starting:opacity-0" />
                    <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-zinc-500"></div>
                            <div className="w-1 h-1 bg-zinc-500/50"></div>
                            <div className="w-1 h-1 bg-zinc-500/20"></div>
                        </div>
                        <div className="text-[10px] tracking-widest text-zinc-600 font-mono">BUILD 24.0.1-RC</div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="text-[10px] text-zinc-600 font-mono cursor-pointer hover:text-zinc-400 transition-colors">
                            {t("tauri:splash.help")}
                        </div>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto hover:opacity-70 transition-opacity">
                            <img src="/icons/company/github.svg" alt="GitHub" className="size-4 invert cursor-pointer" />
                        </a>
                    </div>
                </div>

                <div className="relative z-20 flex flex-col items-center justify-center h-full gap-8 pointer-events-none">
                    <div className="relative group opacity-100 scale-100 transition-all duration-700 ease-out starting:opacity-0 starting:scale-90">
                        <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full opacity-100 transition-opacity duration-1000 starting:opacity-0" />
                        <img src="/icons/logo.svg" alt="Voxel" className="size-24 animate-pulse" />
                    </div>

                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-400 opacity-100 translate-y-0 transition-all duration-500 delay-200 starting:opacity-0 starting:translate-y-4">
                            VOXEL
                        </h1>
                        <p className="text-xs tracking-[0.3em] font-medium text-zinc-500 uppercase opacity-100 translate-y-0 transition-all duration-500 delay-300 starting:opacity-0 starting:translate-y-4">
                            {t("tauri:splash.subtitle")}
                        </p>
                    </div>

                    <div className="absolute bottom-20 flex flex-col items-center gap-3 w-64 opacity-100 transition-opacity duration-500 delay-500 starting:opacity-0">
                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest animate-pulse">{t("tauri:splash.loading")}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
