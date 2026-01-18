import RenderGuard from "@/components/tools/elements/RenderGuard";
import Range from "@/components/ui/Range";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";
export type ToolRangeType = BaseInteractiveComponent & {
    label: string;
    min: number;
    max: number;
    step: number;
};

export default function ToolRange(props: ToolRangeType & { index?: number }) {
    const t = useTranslate();
    const { value, lock, handleChange } = useInteractiveLogic<ToolRangeType, number>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <Range
                value={value}
                min={props.min}
                max={props.max}
                step={props.step}
                disabled={lock.isLocked}
                label={lock.isLocked ? t(lock.text) : props.label}
                onChangeEnd={handleChange}
            />
        </RenderGuard>
    );
}
