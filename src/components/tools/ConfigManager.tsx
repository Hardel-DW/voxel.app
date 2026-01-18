import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import RestoreLastSession from "./RestoreLastSession";

export default function ConfigManager(props: PropsWithChildren) {
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    if (hasElements) return props.children;

    return (
        <div className="size-full flex items-center justify-center flex-col gap-y-4">
            <h1 className="text-zinc-400 text-2xl font-bold">{t("no_config.title")}</h1>
            <div className="text-zinc-400 text-sm text-center">
                {t("no_config.description.1")}
                <br />
                {t("no_config.description.2")}
            </div>
            <div className="w-1/2">
                <hr />
            </div>
            <div className="flex gap-4">
                <RestoreLastSession />
                <Button variant="ghost_border" size="sm" href="/">
                    {t("back")}
                </Button>
            </div>
        </div>
    );
}
