import { Link, useNavigate } from "@tanstack/react-router";
import { useHomeStore } from "@/lib/store/HomeStore";
import Avatar from "@/components/ui/Avatar";
import { t } from "@/lib/i18n";
import { openDatapackFromPath, useProjectStore } from "@/lib/store/ProjectStore";

export default function HomeSidebar() {
    const navigate = useNavigate();
    const recentProjects = useHomeStore((s) => s.recentProjects);
    const displayedProjects = recentProjects.slice(0, 5);

    return (
        <div className="flex flex-col h-full py-3">
            <nav className="flex-1 flex flex-col items-center gap-2 px-2 overflow-y-auto">
                {/* Navigation links */}
                <Link
                    to="/"
                    className="group size-10 rounded-xl flex items-center justify-center hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    title={t("tauri:home.nav.home")}>
                    <svg
                        className="size-5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                </Link>

                {displayedProjects.length > 0 && (
                    <>
                        <div className="w-8 h-px bg-zinc-800/50 my-2" />
                        {displayedProjects.map((project) => (
                            <button
                                key={project.path}
                                type="button"
                                className="group relative size-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-105"
                                title={project.name}
                                onClick={() => openDatapackFromPath(project.path, () => navigate({ to: "/editor/enchantment/overview" }))}>
                                <Avatar name={project.name} icon={project.icon} className="size-full" />
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                            </button>
                        ))}
                    </>
                )}

                {/* Add new project */}
                <button
                    type="button"
                    className="group size-10 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-zinc-800/40"
                    title={t("tauri:home.nav.new_project")}
                    onClick={() => useProjectStore.getState().createNewProject()}>
                    <svg
                        className="size-4 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </nav>

            <div className="flex flex-col items-center gap-2 px-2 mt-auto">
                <div className="w-8 h-px bg-zinc-800/50 mb-1" />

                <Link
                    to="/"
                    className="group size-10 rounded-xl flex items-center justify-center hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    title={t("settings")}>
                    <svg
                        className="size-5 text-zinc-500 group-hover:text-zinc-300 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Link>

                <button
                    type="button"
                    className="group size-10 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 border border-zinc-600/50 flex items-center justify-center cursor-pointer hover:from-zinc-600 hover:to-zinc-700 transition-all"
                    title={t("tauri:home.user.connect")}>
                    <svg
                        className="size-5 text-zinc-400 group-hover:text-zinc-200 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
