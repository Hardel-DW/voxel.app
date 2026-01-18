import type { ErrorComponentProps } from "@tanstack/react-router";
import SimpleLayout from "@/components/layout/SimpleLayout";
import { Button } from "@/components/ui/Button";
import { useTranslate } from "@/lib/i18n";

export default function DefaultCatchBoundary({ error }: ErrorComponentProps) {
    const t = useTranslate();

    return (
        <SimpleLayout>
            <div className="relative z-10 px-8 py-12 w-full max-w-3xl mx-auto">
                <h1 className="text-6xl font-bold text-white mb-4">{t("generic.error_occurred")}</h1>
                <p className="text-xl text-zinc-400 mb-12">{t("generic.something_went_wrong")}</p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left mb-8">
                    <p className="text-sm text-zinc-400 font-mono ">{error.message || t("generic.unexpected_error")}</p>
                </div>
                <Button to="/" variant="black" className="w-full shimmer-neutral-950 border-zinc-800 hover:shimmer-neutral-900">
                    {t("generic.go_to_home")}
                </Button>
            </div>
        </SimpleLayout>
    );
}
