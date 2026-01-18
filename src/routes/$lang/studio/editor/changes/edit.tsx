import { createFileRoute } from "@tanstack/react-router";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import { Badge } from "@/components/ui/Badge";
import JsonEditor from "@/components/ui/codeblock/JsonEditor";
import { FloatingBanner } from "@/components/ui/FloatingBanner";
import { useTranslate } from "@/lib/i18n";
import { useChangesStore } from "@/lib/store/ChangesStore";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/edit")({
    component: ChangesEditPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function decodeFile(data: Uint8Array | undefined): string {
    if (!data) return "";
    return JSON.stringify(JSON.parse(new TextDecoder().decode(data)), null, 4);
}

function ChangesEditPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { compiledFiles } = useChangesStore();

    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const name = identifier?.toFileName(true) ?? file.split("/").pop() ?? "";
    const compiled = decodeFile(compiledFiles[file]);

    return (
        <div className="flex flex-col h-full relative">
            <DiffHeader name={name} file={file} lang={lang} currentView="edit" />
            <JsonEditor key={file} initialValue={compiled} className="flex-1 bg-zinc-950" />
            <FloatingBanner icon="/icons/tools/diff/edit.svg" hue={0}>
                <div className="flex items-center gap-1">
                    <Badge hue={0}>{t("changes:banner.edit.badge")}</Badge>
                    <h3 className="text-sm font-semibold text-white/90 tracking-tight">{t("changes:banner.edit.title")}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-zinc-300/80 font-light">{t("changes:banner.edit.description")}</p>
            </FloatingBanner>
        </div>
    );
}
