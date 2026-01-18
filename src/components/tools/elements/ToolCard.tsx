import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ToolInlineType = BaseInteractiveComponent & {
    description?: string;
    title: string;
    image: string;
};

export default function ToolInlineSlot(props: ToolInlineType) {
    const t = useTranslate();
    const { value, lock, handleChange } = useInteractiveLogic<ToolInlineType, boolean>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <button
                type="button"
                className={cn(
                    "bg-black/35 group text-start select-none ring-0 h-48 cursor-pointer ring-zinc-700 relative transition-all hover:ring-1 rounded-xl mask",
                    { "ring-1 ring-zinc-600": value },
                    { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
                )}
                onClick={() => handleChange(!value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleChange(!value);
                }}
                tabIndex={0}>
                {value && !lock.isLocked && (
                    <div className="absolute z-30 top-0 right-0 p-2 bg-zinc-950/75 rounded-bl-xl rounded-tr-2xl">
                        <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />
                    </div>
                )}

                {lock.isLocked && <span className="absolute top-0 p-4 text-xs text-zinc-400 font-light">{t(lock.text)}</span>}

                <div className="stack h-full rounded-2xl overflow-hidden">
                    <div className="pb-2 self-end px-4 relative z-20">
                        <h3 className="text-xl font-semibold text-white">{props.title}</h3>
                        {props.description && <p className="text-sm text-zinc-400">{props.description}</p>}
                    </div>
                    <div className="rounded-2xl relative bg-shadow-bottom z-10" />
                    <div
                        className="w-full h-full rounded-2xl bg-cover bg-center group-hover:scale-110 duration-500 ease-in-out transition mask-b-from-20%"
                        style={{ backgroundImage: `url(${props.image})` }}
                    />
                </div>
            </button>
        </RenderGuard>
    );
}
