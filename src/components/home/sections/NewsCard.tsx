import { getLocale } from "@/lib/i18n";

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: "update" | "feature" | "announcement";
    image?: string;
}

const TYPE_STYLES = {
    update: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    feature: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    announcement: "bg-amber-500/10 text-amber-400 border-amber-500/20"
};


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
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${TYPE_STYLES[item.type]}`}>
                        {item.type}
                    </span>
                </div>
                <div>
                    <h3 className="font-medium text-zinc-200 text-sm">{item.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <p className="text-xs text-zinc-600">{formattedDate}</p>
            </div>
        </div>
    );
}