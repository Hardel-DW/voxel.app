import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/Button";
import LineSetup from "@/components/ui/line/LineSetup";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { Route } from "@/routes/$lang";
import RestoreLastSession from "./RestoreLastSession";

export default function ConfigManager(props: PropsWithChildren) {
    const t = useTranslate();
    const { lang } = Route.useParams();
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    if (hasElements) return props.children;

    return (
        <div className="size-full flex items-center justify-center flex-col gap-y-4 bg-sidebar relative">
            <div className="absolute z-0 inset-0 scale-110">
                <svg
                    className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
                    style={{ transform: "skewY(-12deg)" }}>
                    <defs>
                        <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                            <path d="M64 0H0V64" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <LineSetup />

            <h1 className="text-zinc-400 text-2xl font-bold">{t("no_config.title")}</h1>
            <div className="text-zinc-400 text-sm text-center">
                {t("no_config.description.1")}
                <br />
                {t("no_config.description.2")}
            </div>
            <div className="w-1/2">
                <hr />
            </div>
            <div className="flex gap-4 relative z-10">
                <RestoreLastSession />
                <Button variant="ghost_border" size="sm" to="/$lang/studio" params={{ lang }}>
                    {t("back_to_home")}
                </Button>
            </div>
        </div>
    );
}
