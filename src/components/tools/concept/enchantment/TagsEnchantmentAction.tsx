import { Switch } from "@/components/ui/Switch";
import { type ActionOrBuilder, type BaseRender, useActionHandler, useRenderer } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";

export type TagsEnchantmentActionProps = {
    title: string;
    subtitle?: string;
    description: string;
    action: ActionOrBuilder;
    renderer?: BaseRender;
    type?: "toggle" | "action";
};

export function TagsEnchantmentAction(props: TagsEnchantmentActionProps & { elementId?: string; lock: { isLocked: boolean } }) {
    const actionHandler = useActionHandler(props.action, { elementId: props.elementId });
    const isChecked = useRenderer<boolean>(props.renderer, props.elementId);
    const t = useTranslate();

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.lock.isLocked) return;
        actionHandler.handleChange(!isChecked);
    };

    return (
        <label
            htmlFor="action-switch"
            className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-zinc-900/50 cursor-pointer transition-colors"
            onClick={handleAction}>
            <div className="flex flex-col flex-1">
                <div className="text-sm text-zinc-200 flex items-center gap-2">
                    <span className="text-sm text-zinc-200">{t(props.title)}</span>
                    {props.subtitle && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-900/20 px-1 py-0.5 rounded-md border border-zinc-900">
                            {t(props.subtitle)}
                        </span>
                    )}
                </div>
                <span className="text-xs text-zinc-500">{t(props.description)}</span>
            </div>
            <Switch id="action-switch" isChecked={isChecked ?? false} setIsChecked={() => {}} disabled={props.lock.isLocked} />
        </label>
    );
}
