import { useId } from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import { Switch } from "@/components/ui/Switch";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";
export type ToolSwitchType = BaseInteractiveComponent & {
    title: string;
    description: string;
};

export default function ToolSwitch(props: ToolSwitchType) {
    const t = useTranslate();
    const id = useId();
    const { value, lock, handleChange } = useInteractiveLogic<ToolSwitchType, boolean>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/35 border border-zinc-900 transition-transform duration-150 ease-out hover:-translate-y-1 p-6 rounded-xl relative overflow-hidden isolate">
                <label htmlFor={id} className="flex items-center justify-between w-full cursor-pointer">
                    <div className="flex flex-col w-3/4">
                        <span className="text-white line-clamp-1">{props.title}</span>
                        <span className="text-xs text-zinc-400 font-light line-clamp-2">
                            {lock.isLocked ? (
                                <span className="text-xs text-zinc-400 font-light w-max">{t(lock.text)}</span>
                            ) : (
                                props.description
                            )}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Switch id={id} isChecked={value} setIsChecked={handleChange} disabled={lock.isLocked} />
                    </div>
                </label>
                <div className="absolute inset-0 -z-10 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
                </div>
            </div>
        </RenderGuard>
    );
}
