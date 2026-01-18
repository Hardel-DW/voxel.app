import { createFileRoute } from "@tanstack/react-router";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import { Badge } from "@/components/ui/Badge";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import CodeDiff from "@/components/ui/codeblock/CodeDiff";
import { FloatingBanner } from "@/components/ui/FloatingBanner";
import { useTranslate } from "@/lib/i18n";
import { useChangesStore } from "@/lib/store/ChangesStore";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/diff")({
    component: ChangesDiffPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function decodeFile(data: Uint8Array | undefined): string {
    if (!data) return "";
    return JSON.stringify(JSON.parse(new TextDecoder().decode(data)), null, 4);
}

function ChangesDiffPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { originalFiles, compiledFiles, diff } = useChangesStore();
    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;

    const identifier = parseFilePath(file);
    const fileName = file?.split("/").pop();
    const name = identifier?.toFileName(true) ?? fileName ?? "";
    const status = diff.get(file);
    const compiled = decodeFile(compiledFiles[file]);
    const original = decodeFile(originalFiles[file]);

    return (
        <div className="flex flex-col h-full relative">
            <DiffHeader name={name} file={file} lang={lang} currentView="diff" />
            <FloatingBanner icon="/icons/tools/diff/diff.svg" hue={200}>
                <div className="flex items-center gap-1">
                    <Badge hue={200}>{t("changes:banner.diff.badge")}</Badge>
                    <h3 className="text-sm font-semibold text-white/90 tracking-tight">{t("changes:banner.diff.title")}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-zinc-300/80 font-light">{t("changes:banner.diff.description")}</p>
            </FloatingBanner>
            {!status || status === "unchanged" ? (
                <CodeBlock key={file} language="json">
                    {compiled}
                </CodeBlock>
            ) : (
                <CodeDiff key={file} original={original} compiled={compiled} status={status} />
            )}
        </div>
    );
}
