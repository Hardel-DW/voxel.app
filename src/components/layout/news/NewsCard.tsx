import { getLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: "Update" | "Feature" | "Announcement";
    image?: string;
}

export default function NewsCard({ item }: { item: NewsItem }) {
    const formattedDate = new Intl.DateTimeFormat(getLocale(), { dateStyle: "medium" }).format(new Date(item.date));

    return (
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden hover:border-zinc-700/50 transition-colors">
            {item.image && (
                <div className="h-32 bg-zinc-800/50 overflow-hidden">
                    <img src={item.image} alt="" className="size-full object-cover" />
                </div>
            )}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={cn(
                            "text-xs px-2 py-0.5 rounded-md font-medium border ",
                            item.type === "Update" && "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
                            item.type === "Feature" && "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
                            item.type === "Announcement" && "bg-amber-500/5 text-amber-600 border-amber-500/10"
                        )}>
                        {item.type}
                    </span>
                    <p className="text-xs text-zinc-600">{formattedDate}</p>
                </div>
                <div>
                    <h3 className="font-medium text-zinc-200 text-sm">{item.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
            </div>
        </div>
    );
}
