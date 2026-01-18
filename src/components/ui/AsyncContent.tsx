import { useTranslate } from "@/lib/i18n";

interface AsyncContentProps {
    loading: boolean;
    empty: boolean;
    loadingText?: string;
    emptyText?: string;
    children: React.ReactNode;
}

export default function AsyncContent({ loading, empty, loadingText, emptyText, children }: AsyncContentProps) {
    const t = useTranslate();

    if (loading && empty) return <p className="text-zinc-500 text-center py-8">{loadingText ?? t("tauri:generic.loading")}</p>;
    if (empty) return <p className="text-zinc-500 text-center py-8">{emptyText ?? t("tauri:generic.no_items")}</p>;
    return <>{children}</>;
}
