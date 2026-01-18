import { createFileRoute } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { DiffEmptyState } from "@/components/tools/concept/changes/DiffEmptyState";
import { DiffHeader } from "@/components/tools/concept/changes/DiffHeader";
import { Badge } from "@/components/ui/Badge";
import CodeBlock from "@/components/ui/codeblock/CodeBlock";
import { FloatingBanner } from "@/components/ui/FloatingBanner";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { parseFilePath } from "@/lib/utils/concept";

export const Route = createFileRoute("/$lang/studio/editor/changes/patch")({
    component: ChangesPatchPage,
    validateSearch: (search) => ({ file: search.file as string })
});

function ChangesPatchPage() {
    const t = useTranslate();
    const { file } = Route.useSearch();
    const { lang } = Route.useParams();
    const { logger } = useConfiguratorStore.getState();

    if (!file || !file.endsWith(".json")) return <DiffEmptyState file={file} />;
    const identifier = parseFilePath(file);
    const fileName = file?.split("/").pop();
    const name = identifier?.toFileName(true) ?? fileName ?? "";
    const logsData =
        identifier && logger ? logger.getChangeSets().filter((change) => new Identifier(change.identifier).equals(identifier)) : [];

    return (
        <div className="flex flex-col h-full relative">
            <DiffHeader name={name} file={file} lang={lang} currentView="patch" />
            <FloatingBanner icon="/icons/tools/diff/patch.svg" hue={300}>
                <div className="flex items-center gap-1">
                    <Badge hue={300}>{t("changes:banner.patch.badge")}</Badge>
                    <h3 className="text-sm font-semibold text-white/90 tracking-tight">{t("changes:banner.patch.title")}</h3>
                </div>
                <p className="text-[13px] leading-relaxed text-zinc-300/80 font-light">{t("changes:banner.patch.description")}</p>
            </FloatingBanner>
            <CodeBlock language="json">{logsData.length > 0 ? JSON.stringify(logsData, null, 4) : t("changes:diff.no_data")}</CodeBlock>
        </div>
    );
}
