import { Switch } from "@/components/ui/Switch";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

export default function SimpleSwitch(props: BaseInteractiveComponent) {
    const { value, handleChange } = useInteractiveLogic<BaseInteractiveComponent, boolean>({ component: props }, props.elementId);
    if (value === null) return null;

    return (
        <label htmlFor={props.elementId} className="flex items-center gap-2 cursor-pointer shrink-0">
            <Switch isChecked={value} setIsChecked={handleChange} />
        </label>
    );
}
