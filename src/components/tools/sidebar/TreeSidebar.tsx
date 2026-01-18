import { SidebarButton } from "@/components/tools/sidebar/SidebarButton";
import { SidebarUpdated } from "@/components/tools/sidebar/SidebarUpdated";
import { FileTree } from "@/components/ui/tree/FileTree";
import { useTree } from "@/components/ui/tree/useTree";
import { useTranslate } from "@/lib/i18n";

export function TreeSidebar() {
    const t = useTranslate();
    const { tree, isAllActive, selectAll } = useTree();

    return (
        <div className="space-y-1 mt-4">
            <SidebarUpdated />
            <SidebarButton icon="/icons/search.svg" count={tree.count} isActive={isAllActive} onClick={selectAll}>
                {t("tree.all")}
            </SidebarButton>
            <FileTree />
        </div>
    );
}
