import RenderGuard from "@/components/tools/elements/RenderGuard";
import CounterUI from "@/components/ui/Counter";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

export type ToolCounterProps = BaseInteractiveComponent & {
    min: number;
    max: number;
    step: number;
};

export default function ToolCounter(props: ToolCounterProps) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolCounterProps, number>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <CounterUI
                value={value}
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={handleChange}
                disabled={lock.isLocked || !!props.lock}
            />
        </RenderGuard>
    );
}
