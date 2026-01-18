import { use } from "react";
import { TreeContext } from "@/components/ui/tree/TreeNavigationContext";

export function useTree() {
    const context = use(TreeContext);
    if (!context) {
        throw new Error("useTree must be used within TreeProvider");
    }
    return context;
}
