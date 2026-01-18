import type { Analysers, GetAnalyserVoxel } from "@voxelio/breeze";
import { Identifier, isVoxel } from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export function useElementsByType<T extends keyof Analysers>(elementType: T) {
    return useConfiguratorStore(
        useShallow((s) => Array.from(s.elements.values()).filter((e): e is GetAnalyserVoxel<T> => isVoxel(e, elementType)))
    );
}

export function useElementsIdByType<T extends keyof Analysers>(elementType: T) {
    return useConfiguratorStore(
        useShallow((s) =>
            Array.from(s.elements.values())
                .filter((e) => isVoxel(e, elementType))
                .map((e) => new Identifier((e as GetAnalyserVoxel<T>).identifier).toUniqueKey())
        )
    );
}
