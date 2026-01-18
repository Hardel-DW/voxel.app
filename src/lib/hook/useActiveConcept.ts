import { useLocation } from "@tanstack/react-router";
import { CONCEPTS } from "@/lib/data/elements";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { getConceptFromPathname } from "@/lib/utils/concept";

export function useActiveConcept() {
    const pathname = useLocation({ select: (loc) => loc.pathname });
    const selectedElement = useNavigationStore((state) => state.currentElementId);
    const currentConcept = getConceptFromPathname(pathname);
    const concept = CONCEPTS.find((c) => c.registry === currentConcept);
    const activeTab = concept?.tabs.find((tab) => pathname === tab.url);

    return {
        concept,
        tabs: concept?.tabs ?? [],
        activeTab,
        hasSelectedElement: !!selectedElement,
        isOnValidTab: !!activeTab,
        showTabs: !!selectedElement && !!activeTab && (concept?.tabs.length ?? 0) > 1
    };
}
