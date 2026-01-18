import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ToolInlineType = BaseInteractiveComponent & {
    title: string;
    description: string;
    image?: string;
};

export default function ToolInline(props: ToolInlineType) {
    const t = useTranslate();
    const { value, lock, handleChange } = useInteractiveLogic<ToolInlineType, boolean>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <button
                type="button"
                className={cn(
                    "bg-black/35 border cursor-pointer border-zinc-900 select-none relative rounded-xl px-6 py-4 transition-transform duration-150 ease-out hover:-translate-y-1 isolate w-full text-left",
                    { "bg-zinc-950/50 ring-1 ring-zinc-700": value },
                    { "opacity-50 ring-1 ring-zinc-700": lock.isLocked }
                )}
                onClick={() => handleChange(!value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleChange(!value);
                }}
                disabled={lock.isLocked}>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        {props.image && (
                            <div className="shrink-0">
                                <img src={props.image} alt="Icon" className="w-8 h-8 object-contain pixelated" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-white line-clamp-1">{props.title}</span>
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">{props.description}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        {lock.isLocked && <span className="text-xs text-zinc-400 font-light w-max flex items-center">{t(lock.text)}</span>}
                        {value && !lock.isLocked && <img src="/icons/check.svg" alt="checkbox" className="w-6 h-6 invert" />}
                        {lock.isLocked && <img src="/icons/tools/lock.svg" alt="checkbox" className="w-6 h-6" />}
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 brightness-15 top-0">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
                </div>
            </button>
        </RenderGuard>
    );
}
