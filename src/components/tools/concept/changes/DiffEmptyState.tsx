import { useTranslate } from "@/lib/i18n";

export function DiffEmptyState({ file }: { file: string | undefined }) {
    const t = useTranslate();

    if (!file) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/search.svg" className="size-12 opacity-20 invert" alt="Search icon" />
                <p className="text-sm">{t("changes:diff.select_file")}</p>
            </div>
        );
    }

    if (!file.endsWith(".json")) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-4">
                <img src="/icons/tools/crafting/code.svg" className="size-12 opacity-20 invert" alt="Code icon" />
                <p className="text-sm">{t("changes:diff.preview_unavailable")}</p>
                <p className="text-xs text-zinc-600">{file}</p>
            </div>
        );
    }

    return null;
}
