import type { Analysers, GetAnalyserVoxel } from "@voxelio/breeze";
import { isVoxel } from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { useConfiguratorStore } from "@/components/tools/Store";

export function useElementsByType<T extends keyof Analysers>(elementType: T) {
    return useConfiguratorStore(
        useShallow((s) => Array.from(s.elements.values()).filter((e): e is GetAnalyserVoxel<T> => isVoxel(e, elementType)))
    );
}
