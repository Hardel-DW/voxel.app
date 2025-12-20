import { ReactNode, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import HomeSidebar from "./HomeSidebar";
import DropZone from "./DropZone";

const appWindow = getCurrentWindow();

export default function HomeLayout({ children }: { children: ReactNode }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = () => setIsDragging(true);

    return (
        <div
            className="flex h-screen w-full bg-[#09090b] text-zinc-200 select-none font-rubik overflow-hidden relative"
            onDragEnter={handleDragEnter}
        >
            {/* Background Texture & Ambient Light */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute top-[-20%] right-[-10%] size-[800px] bg-violet-900/10 blur-[120px] rounded-full pointer-events-none" />

            <HomeSidebar />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Custom Window Controls integrated nicely */}
                <header data-tauri-drag-region className="shrink-0 h-10 flex items-center justify-end px-4 border-b border-white/5 bg-zinc-950/30 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <WindowButton onClick={() => appWindow.minimize()} icon="min" />
                        <WindowButton onClick={() => appWindow.toggleMaximize()} icon="max" />
                        <WindowButton onClick={() => appWindow.close()} icon="close" danger />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/50 scrollbar-track-transparent p-8">
                    <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
                        {children}
                    </div>
                </main>
            </div>

            <DropZone isDragging={isDragging} onLeave={() => setIsDragging(false)} />
        </div>
    );
}

function WindowButton({ onClick, icon, danger }: { onClick: () => void; icon: string; danger?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={`size-3 rounded-full flex items-center justify-center transition-all ${danger ? 'bg-red-500/20 hover:bg-red-500 text-transparent hover:text-black' : 'bg-white/10 hover:bg-white/30'}`}
        />
    );
}

export default function DropZone({ isDragging, onLeave }: { isDragging: boolean; onLeave: () => void }) {
    if (!isDragging) return null;

    return (
        <div
            className="absolute inset-4 z-50 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-200"
            onDragLeave={onLeave}
            onDrop={(e) => {
                e.preventDefault();
                onLeave();
                // Handle drop logic here
            }}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="p-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]">
                <img src="/icons/import.svg" className="size-16 text-emerald-500" alt="Import" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Drop your project here</h2>
            <p className="text-zinc-400 text-lg">Supports .zip, folder, or datapack.mcmeta</p>
        </div>
    );
}

import { Link } from "@tanstack/react-router";

export default function HomeSidebar() {
    return (
        <aside className="shrink-0 w-[72px] flex flex-col items-center py-6 bg-zinc-950/50 border-r border-white/5 backdrop-blur-xl z-20">
            <Link to="/" className="mb-8 group relative">
                <div className="absolute inset-0 bg-violet-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <img src="/icons/logo.svg" alt="Voxel" className="size-10 relative z-10 transform group-hover:scale-105 transition-transform" />
            </Link>

            <nav className="flex-1 flex flex-col gap-4 w-full px-3">
                <NavIcon icon="/icons/home.svg" label="Home" active />
                <NavIcon icon="/icons/folder.svg" label="Projects" />
                <NavIcon icon="/icons/globe.svg" label="Community" />
                <div className="h-px w-full bg-white/5 my-2" />
                <NavIcon icon="/icons/settings.svg" label="Settings" />
            </nav>

            <div className="mt-auto">
                <button className="size-10 rounded-full bg-linear-to-tr from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden hover:border-white/30 transition-all">
                    <img src="https://github.com/shadcn.png" className="size-full object-cover opacity-80 hover:opacity-100" />
                </button>
            </div>
        </aside>
    );
}

function NavIcon({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
    return (
        <div className="group relative flex items-center justify-center">
            {active && <div className="absolute left-[-14px] top-1/2 -translate-y-1/2 h-8 w-1 bg-violet-500 rounded-r-full shadow-[0_0_10px_2px_rgba(139,92,246,0.3)]" />}
            <button className={`
                size-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}
            `}>
                <img src={icon} className={`size-6 ${!active && 'opacity-60 grayscale'}`} />
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 border border-white/10 rounded text-xs font-medium text-white opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all z-50 whitespace-nowrap">
                {label}
            </div>
        </div>
    );
}

export default function QuickActions() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[160px]">
            {/* Create New */}
            <button className="group relative col-span-2 h-full rounded-2xl overflow-hidden bg-linear-to-br from-violet-900/20 to-indigo-900/10 border border-white/5 hover:border-violet-500/30 transition-all text-left p-6 flex flex-col justify-between">
                <div className="absolute right-0 top-0 p-20 bg-violet-600/10 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-colors" />

                <div className="relative z-10">
                    <div className="size-12 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/icons/plus.svg" className="size-6 text-violet-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white">New Project</h3>
                    <p className="text-zinc-400 text-sm mt-1">Start a datapack or resource pack from scratch.</p>
                </div>
            </button>

            {/* Import */}
            <button className="group relative h-full rounded-2xl overflow-hidden bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 transition-all text-left p-6 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                <div className="relative z-10">
                    <div className="size-10 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                        <img src="/icons/download.svg" className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">Import</h3>
                    <p className="text-zinc-500 text-xs mt-1">From Folder or ZIP</p>
                </div>
            </button>
        </section>
    );
}

export default function QuickActions() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[160px]">
            {/* Create New */}
            <button className="group relative col-span-2 h-full rounded-2xl overflow-hidden bg-linear-to-br from-violet-900/20 to-indigo-900/10 border border-white/5 hover:border-violet-500/30 transition-all text-left p-6 flex flex-col justify-between">
                <div className="absolute right-0 top-0 p-20 bg-violet-600/10 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-colors" />

                <div className="relative z-10">
                    <div className="size-12 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/icons/plus.svg" className="size-6 text-violet-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white">New Project</h3>
                    <p className="text-zinc-400 text-sm mt-1">Start a datapack or resource pack from scratch.</p>
                </div>
            </button>

            {/* Import */}
            <button className="group relative h-full rounded-2xl overflow-hidden bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 transition-all text-left p-6 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                <div className="relative z-10">
                    <div className="size-10 rounded-lg bg-zinc-800/50 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                        <img src="/icons/download.svg" className="size-5" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">Import</h3>
                    <p className="text-zinc-500 text-xs mt-1">From Folder or ZIP</p>
                </div>
            </button>
        </section>
    );
}

import { Link } from "@tanstack/react-router";
import { getLocale } from "@/lib/i18n";

const projects = [
    { id: "1", name: "Origins SMP v2", world: "Survival S4", type: "Datapack", date: new Date(), icon: null },
    { id: "2", name: "Custom Spells", world: "Magic Test", type: "Datapack", date: new Date(Date.now() - 86400000), icon: "/images/features/item/book.webp" },
    { id: "3", name: "Better Biomes", world: "Terrain Gen", type: "Resource Pack", date: new Date(Date.now() - 100000000), icon: "/images/features/item/grass_block.webp" },
];

export default function ProjectList() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-zinc-200">Recent Projects</h2>
                <div className="flex items-center gap-2">
                    <SearchInput />
                    <FilterButton />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {projects.map(p => (
                    <ProjectRow key={p.id} project={p} />
                ))}
            </div>
        </section>
    );
}

function ProjectRow({ project }: { project: any }) {
    return (
        <Link
            to="/editor"
            className="group flex items-center gap-4 p-3 rounded-xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-800/40 hover:border-white/10 transition-all cursor-pointer"
        >
            {/* Icon */}
            <div className="size-12 shrink-0 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center overflow-hidden">
                {project.icon ? (
                    <img src={project.icon} className="size-full object-cover pixelated opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <span className="font-minecraft text-xl text-zinc-600 group-hover:text-zinc-400">{project.name[0]}</span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-medium text-zinc-200 group-hover:text-white truncate">{project.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <img src="/icons/globe.svg" className="size-3 opacity-50" />
                        {project.world}
                    </span>
                    <span className="size-1 rounded-full bg-zinc-700" />
                    <span>{project.type}</span>
                </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-end gap-1 pl-4">
                <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-400">
                    {new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(project.date)}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button className="p-1 hover:bg-white/10 rounded"><img src="/icons/edit.svg" className="size-3" /></button>
                </div>
            </div>
        </Link>
    );
}

const SearchInput = () => (
    <div className="relative group">
        <img src="/icons/search.svg" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-zinc-400" />
        <input
            type="text"
            placeholder="Search..."
            className="h-9 w-48 pl-9 pr-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:w-64 transition-all"
        />
    </div>
);

const FilterButton = () => (
    <button className="size-9 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:text-white text-zinc-500 transition-colors">
        <img src="/icons/filter.svg" className="size-4" />
    </button>
);

import { Link } from "@tanstack/react-router";
import { getLocale } from "@/lib/i18n";

const projects = [
    { id: "1", name: "Origins SMP v2", world: "Survival S4", type: "Datapack", date: new Date(), icon: null },
    { id: "2", name: "Custom Spells", world: "Magic Test", type: "Datapack", date: new Date(Date.now() - 86400000), icon: "/images/features/item/book.webp" },
    { id: "3", name: "Better Biomes", world: "Terrain Gen", type: "Resource Pack", date: new Date(Date.now() - 100000000), icon: "/images/features/item/grass_block.webp" },
];

export default function ProjectList() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-zinc-200">Recent Projects</h2>
                <div className="flex items-center gap-2">
                    <SearchInput />
                    <FilterButton />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {projects.map(p => (
                    <ProjectRow key={p.id} project={p} />
                ))}
            </div>
        </section>
    );
}

function ProjectRow({ project }: { project: any }) {
    return (
        <Link
            to="/editor"
            className="group flex items-center gap-4 p-3 rounded-xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-800/40 hover:border-white/10 transition-all cursor-pointer"
        >
            {/* Icon */}
            <div className="size-12 shrink-0 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center overflow-hidden">
                {project.icon ? (
                    <img src={project.icon} className="size-full object-cover pixelated opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <span className="font-minecraft text-xl text-zinc-600 group-hover:text-zinc-400">{project.name[0]}</span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-medium text-zinc-200 group-hover:text-white truncate">{project.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <img src="/icons/globe.svg" className="size-3 opacity-50" />
                        {project.world}
                    </span>
                    <span className="size-1 rounded-full bg-zinc-700" />
                    <span>{project.type}</span>
                </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-end gap-1 pl-4">
                <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-400">
                    {new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(project.date)}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button className="p-1 hover:bg-white/10 rounded"><img src="/icons/edit.svg" className="size-3" /></button>
                </div>
            </div>
        </Link>
    );
}

const SearchInput = () => (
    <div className="relative group">
        <img src="/icons/search.svg" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-zinc-400" />
        <input
            type="text"
            placeholder="Search..."
            className="h-9 w-48 pl-9 pr-3 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:w-64 transition-all"
        />
    </div>
);

const FilterButton = () => (
    <button className="size-9 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 hover:text-white text-zinc-500 transition-colors">
        <img src="/icons/filter.svg" className="size-4" />
    </button>
);

import { useState } from "react";

export default function VanillaExplorer() {
    return (
        <div className="flex flex-col h-full bg-zinc-900/10 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <h3 className="font-semibold text-zinc-300 flex items-center gap-2">
                    <img src="/icons/features/item/grass_block.webp" className="size-5 pixelated" />
                    Local Worlds
                </h3>
                <button className="text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-400 uppercase tracking-wide transition-colors">
                    Scan
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                <WorldItem name="New World" path="saves/New World" lastPlayed="2h ago" />
                <WorldItem name="Redstone Test" path="saves/Redstone Test" lastPlayed="2d ago" hasIcon />
                <WorldItem name="Speedrun #41" path="saves/Speedrun" lastPlayed="1w ago" />
            </div>
        </div>
    );
}

function WorldItem({ name, path, lastPlayed, hasIcon }: any) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setOpen(!open)}
                className="group flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 text-left transition-all"
            >
                <img
                    src={hasIcon ? "/icons/features/item/diamond_sword.webp" : "/icons/features/item/map.webp"}
                    className="size-8 rounded bg-zinc-950 border border-white/5 pixelated opacity-70 group-hover:opacity-100"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 truncate">{name}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">{lastPlayed}</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 truncate">{path}</p>
                </div>
            </button>

            {open && (
                <div className="ml-5 pl-4 border-l border-zinc-800 my-1 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 p-1.5 rounded hover:bg-emerald-500/10 hover:text-emerald-400 text-zinc-500 text-xs cursor-pointer transition-colors group/item">
                        <img src="/icons/plus.svg" className="size-3 opacity-50 group-hover/item:opacity-100" />
                        Create Datapack here
                    </div>
                </div>
            )}
        </div>
    );
}