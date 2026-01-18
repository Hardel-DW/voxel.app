import { Identifier, type IdentifierObject } from "@voxelio/breeze";
import { useTranslate } from "@/lib/i18n";

interface BreadcrumbSegment {
    label: string;
    isLast: boolean;
}

interface EditorBreadcrumbProps {
    rootLabel: string;
    identifier?: IdentifierObject;
    filterPath?: string;
    isOverview: boolean;
    onBack?: () => void;
}

export function EditorBreadcrumb(props: EditorBreadcrumbProps) {
    const t = useTranslate();
    const segments = buildSegments(props);

    return (
        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
            {!props.isOverview && props.onBack && (
                <button
                    type="button"
                    onClick={props.onBack}
                    className="cursor-pointer flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors mr-2">
                    <img src="/icons/back.svg" className="size-3.5 invert opacity-50 group-hover:opacity-100" alt="Back" />
                    <span className="text-xs font-medium">{t("back")}</span>
                </button>
            )}
            <span className="opacity-50 text-xs uppercase tracking-wider font-medium">{props.rootLabel}</span>
            {segments.map((segment) => (
                <span key={segment.label} className="flex items-center gap-2">
                    <span className="opacity-30 text-xs">/</span>
                    <span
                        className={
                            segment.isLast
                                ? "text-zinc-200 font-medium text-xs uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-md border border-white/5 backdrop-blur-sm"
                                : "opacity-50 font-medium text-xs uppercase tracking-wider"
                        }>
                        {segment.label}
                    </span>
                </span>
            ))}
        </div>
    );
}

function buildSegments(props: Pick<EditorBreadcrumbProps, "identifier" | "filterPath" | "isOverview">): BreadcrumbSegment[] {
    if (props.isOverview && props.filterPath) {
        const parts = props.filterPath.split("/");
        return parts.map((part, index) => ({
            label: Identifier.toDisplay(part),
            isLast: index === parts.length - 1
        }));
    }

    if (!props.isOverview && props.identifier) {
        const parts = [props.identifier.namespace, ...props.identifier.resource.split("/")];
        return parts.map((part, index) => ({
            label: index === 0 ? part : Identifier.toDisplay(part),
            isLast: index === parts.length - 1
        }));
    }

    return [];
}
