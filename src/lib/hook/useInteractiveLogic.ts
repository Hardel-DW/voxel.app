import type { Action, ActionValue } from "@voxelio/breeze";
import { type BaseComponent, useElementLocks, useElementProperty } from "@/lib/hook/useBreezeElement";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import type { Lock, LockRenderer } from "@/lib/utils/lock";

export type BaseRender = (el: any) => unknown;
export type ActionOrBuilder = Action | ((value: any) => Action);

export interface UseActionHandlerOptions {
    elementId?: string;
    lock?: Lock[];
}

export type BaseInteractiveComponent = BaseComponent & {
    action: ActionOrBuilder;
    renderer: BaseRender;
    lock?: Lock[];
    elementId?: string;
};

export interface UseInteractiveLogicReturn<T> {
    value: T | null;
    lock: LockRenderer;
    handleChange: (newValue: ActionValue) => void;
}

export interface UseInteractiveLogicProps<C extends BaseInteractiveComponent> {
    component: C;
}

export function useRenderer<T = unknown>(renderer?: BaseRender, elementId?: string): T | null {
    const currentElementId = useNavigationStore((state) => elementId ?? state.currentElementId);
    return useElementProperty(renderer, currentElementId, !!currentElementId) as T;
}

export function useActionHandler(action: ActionOrBuilder | undefined, options?: UseActionHandlerOptions) {
    const currentElementId = useNavigationStore((state) => options?.elementId ?? state.currentElementId);
    const lock = useElementLocks(options?.lock, currentElementId);
    const performGlobalHandleChange = useConfiguratorStore((state) => state.handleChange);

    const handleChange = (newValue: ActionValue) => {
        if (!currentElementId || lock.isLocked || !action) return;
        const actionToPerform = typeof action === "function" ? action(newValue) : action;
        performGlobalHandleChange(actionToPerform, currentElementId, newValue);
    };

    return { handleChange, lock };
}

export function useInteractiveLogic<C extends BaseInteractiveComponent, T>(
    props: UseInteractiveLogicProps<C>,
    elementId?: string
): UseInteractiveLogicReturn<T> {
    const value = useRenderer<T>(props.component.renderer, elementId ?? props.component.elementId);
    const { handleChange, lock } = useActionHandler(props.component.action, {
        elementId: elementId ?? props.component.elementId,
        lock: props.component.lock
    });
    return { value, handleChange, lock };
}
