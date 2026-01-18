import { Link } from "@tanstack/react-router";
import type { Tab } from "@/lib/data/elements";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function EditorHeaderTabs(props: { tab: Tab; lang: string; isActive: boolean }) {
    const t = useTranslate();
    return (
        <Link
            key={props.tab.id}
            to={props.tab.url}
            params={{ lang: props.lang }}
            disabled={props.tab.soon}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-lg transition-all border-b-2 text-zinc-400 border-transparent disabled:opacity-40 disabled:cursor-not-allowed",
                props.isActive ? "text-white border-white/60 bg-white/5" : "hover:text-zinc-200 hover:bg-white/5"
            )}>
            {t(props.tab.text)}
        </Link>
    );
}
