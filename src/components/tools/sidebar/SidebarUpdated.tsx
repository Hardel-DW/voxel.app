import { useParams } from "@tanstack/react-router";
import { SidebarLink } from "@/components/tools/sidebar/SidebarLink";
import { useTree } from "@/components/ui/tree/useTree";
import { useTranslate } from "@/lib/i18n";
import { getModifiedElements, useConfiguratorStore } from "@/lib/store/StudioStore";

export function SidebarUpdated() {
    const { changesRoute, clearSelection, concept } = useTree();
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, concept).length);
    const { lang } = useParams({ from: "/$lang" });
    const t = useTranslate();

    return (
        <SidebarLink to={changesRoute} params={{ lang }} icon="/icons/pencil.svg" count={modifiedCount} onClick={clearSelection}>
            {t("tree.updated")}
        </SidebarLink>
    );
}
