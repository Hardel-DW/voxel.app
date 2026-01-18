import { SidebarLink } from "@/components/tools/sidebar/SidebarLink";
import { useTree } from "@/components/ui/tree/useTree";
import { t } from "@/lib/i18n";
import { getModifiedElements, useConfiguratorStore } from "@/lib/store/StudioStore";

export function SidebarUpdated() {
    const { changesRoute, clearSelection, concept } = useTree();
    const modifiedCount = useConfiguratorStore((s) => getModifiedElements(s, concept).length);

    return (
        <SidebarLink to={changesRoute} icon="/icons/pencil.svg" count={modifiedCount} onClick={clearSelection}>
            {t("tree.updated")}
        </SidebarLink>
    );
}
