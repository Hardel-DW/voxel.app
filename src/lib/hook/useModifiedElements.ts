import type { Analysers } from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { getModifiedElements, useConfiguratorStore } from "@/components/tools/Store";

export function useModifiedElements<T extends keyof Analysers>(registry: T) {
    return useConfiguratorStore(useShallow((state) => getModifiedElements(state, registry)));
}
