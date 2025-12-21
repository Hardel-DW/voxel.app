import { t } from "@/lib/i18n";
import type { NewsItem } from "./NewsCard";
import NewsCard from "./NewsCard";


const links = [
    { icon: "/icons/company/discord.svg", label: "Discord", href: "https://discord.gg/8z3tkQhay7" },
    { icon: "/icons/company/github.svg", label: "GitHub", href: "https://github.com/voxelio" }
];


const NEWS_ITEMS: NewsItem[] = [
    {
        id: "1",
        title: "Voxel Studio Pro 2.0",
        description: "New enchantment glint system and improved NBT editor performance.",
        date: "2025-01-15",
        type: "update"
    },
    {
        id: "2",
        title: "Recipe Builder",
        description: "Create custom crafting recipes with our new visual editor.",
        date: "2025-01-10",
        type: "feature"
    }
];


export default function NewsSidebar() {
    return (
        <aside className="w-80 shrink-0 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-6 pb-6">
                <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4">
                    <div className="flex items-center gap-3">
                        {/* <div className="size-10 rounded-full bg-linear-to-br from-lime-500 to-green-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">V</span>
                </div> */}
                        {/* Placeholder avatar need setup github auth */}
                        <img src="/images/avatar/hardel.webp" alt="User" className="size-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200">{t("home.user.guest")}</p>
                            <p className="text-xs text-zinc-500">{t("home.user.login_hint")}</p>
                        </div>
                        <button
                            type="button"
                            className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg transition-colors cursor-pointer">
                            Connect
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider px-1">
                        {t("home.news.title")}
                    </h3>
                    {NEWS_ITEMS.map((item) => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                </div>
            </div>

            <div className="shrink-0 space-y-4 pt-4">
                <div className="rounded-xl border border-zinc-800/50 bg-linear-to-br from-zinc-600/5 to-neutral-600/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="size-4 text-red-400" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z" />
                        </svg>
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{t("home.support.title")}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">{t("home.support.description")}</p>
                    <a
                        href="https://www.patreon.com/hardel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 text-sm font-medium text-center text-white shimmer-orange-700 hover:shimmer-orange-600 rounded-lg transition-colors cursor-pointer">
                        {t("home.support.button")}
                    </a>
                </div>

                <div className="flex items-center gap-2">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-colors group">
                            <img src={link.icon} alt="" className="size-4 invert opacity-50 group-hover:opacity-80 transition-opacity" />
                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{link.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}
