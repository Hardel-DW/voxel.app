import { Link, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslate } from "@/lib/i18n";

interface EditorSidebarProps {
    title: string;
    icon: string;
    linkTo: string;
    children: ReactNode;
}

export function EditorSidebar({ title, icon, linkTo, children }: EditorSidebarProps) {
    const t = useTranslate();
    const { lang } = useParams({ from: "/$lang" });

    return (
        <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/75 flex flex-col z-20">
            <div className="px-6 pt-6">
                <Link
                    to={linkTo}
                    params={{ lang }}
                    className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1 hover:opacity-80 transition-opacity">
                    <img src={icon} className="size-5 opacity-80" alt="Title icon" />
                    {t(title)}
                </Link>
                <p className="text-xs text-zinc-500 pl-7">{t("explore")}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-3">{children}</div>

            <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                <a
                    href="https://discord.gg/TAmVFvkHep"
                    className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50 flex items-center gap-3 group hover:border-zinc-700/50 transition-colors">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                            {t("common.help.discord")}
                        </div>
                    </div>
                    <div className="size-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                        <img
                            src="/icons/company/discord.svg"
                            className="size-4 invert opacity-30 group-hover:opacity-50 transition-opacity"
                            alt="Discord icon"
                        />
                    </div>
                </a>
            </div>
        </aside>
    );
}
