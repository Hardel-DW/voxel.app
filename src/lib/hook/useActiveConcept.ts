import { useLocation } from "@tanstack/react-router";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";

export function useActiveConcept() {
    const location = useLocation();
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const selectedElement = useConfiguratorStore((state) => state.currentElementId);
    const currentConcept = getConcept(location.pathname);
    const concept = CONCEPTS.find((c) => c.registry === currentConcept);
    const activeTab = concept?.tabs.find((tab) => location.pathname === tab.url);

    return {
        concept,
        tabs: concept?.tabs ?? [],
        activeTab,
        hasSelectedElement: !!selectedElement,
        isOnValidTab: !!activeTab,
        showTabs: !!selectedElement && !!activeTab && (concept?.tabs.length ?? 0) > 1
    };
}
