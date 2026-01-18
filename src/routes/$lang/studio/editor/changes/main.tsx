import { createFileRoute } from "@tanstack/react-router";
import EmptyState from "@/components/ui/EmptyState";
import LineBackground from "@/components/ui/line/LineBackground";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/studio/editor/changes/main")({
    component: ChangesMainPage
});

function ChangesMainPage() {
    const t = useTranslate();

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <div className="absolute z-5 inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="absolute z-5 w-full h-full inset-0">
                <LineBackground frequency={2000} />
            </div>
            <div className="z-5 absolute inset-0 scale-110">
                <svg
                    className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
                    style={{ transform: "skewY(-12deg)" }}>
                    <defs>
                        <pattern id="grid-changes" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                            <path d="M64 0H0V64" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-changes)" />
                </svg>
            </div>

            <EmptyState icon="/icons/pencil.svg" title={t("changes:emptystate.title")} description={t("changes:emptystate.description")} />
        </div>
    );
}
