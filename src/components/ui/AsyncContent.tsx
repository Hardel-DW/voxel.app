import { t } from "@/lib/i18n";

interface AsyncContentProps {
    loading: boolean;
    empty: boolean;
    loadingText?: string;
    emptyText?: string;
    children: React.ReactNode;
}

export default function AsyncContent({ loading, empty, loadingText, emptyText, children }: AsyncContentProps) {
    if (loading && empty) return <p className="text-zinc-500 text-center py-8">{loadingText ?? t("generic.loading")}</p>;
    if (empty) return <p className="text-zinc-500 text-center py-8">{emptyText ?? t("generic.noItems")}</p>;
    return <>{children}</>;
}
