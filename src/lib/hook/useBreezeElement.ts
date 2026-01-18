import type { VoxelElement } from "@voxelio/breeze";
import { useShallow } from "zustand/shallow";
import { getCurrentElement, useConfiguratorStore } from "@/lib/store/StudioStore";
import { type Condition, checkLocks, type Lock, type LockRenderer } from "../utils/lock";

export type BaseComponent = {
    hide?: (el: VoxelElement) => boolean;
};

export const useElementCondition = (condition: Condition | undefined, elementId?: string | null): boolean => {
    const element = useElement(elementId, !!condition);

    if (!condition || !element) return false;
    return condition(element);
};

export const useElementLocks = (locks: Lock[] | undefined, elementId?: string | null): LockRenderer => {
    const lockState = useConfiguratorStore(
        useShallow((state) => {
            if (!locks) return { isLocked: false };
            const element = elementId ? state.elements.get(elementId) : getCurrentElement(state);
            if (!element) return { isLocked: false };
            return checkLocks(locks, element);
        })
    );

    return lockState;
};

export const useElement = (elementId?: string | null, enabled: boolean = true) => {
    return useConfiguratorStore(
        useShallow((state) => {
            if (!enabled) return null;
            return elementId ? state.elements.get(elementId) : getCurrentElement(state);
        })
    );
};

export const useElementProperty = <T>(
    propertySelector?: (element: VoxelElement) => T,
    elementId?: string | null,
    enabled: boolean = true
) => {
    return useConfiguratorStore(
        useShallow((state) => {
            if (!enabled) return null;
            const element = elementId ? state.elements.get(elementId) : getCurrentElement(state);
            return element ? propertySelector?.(element) : null;
        })
    );
};
