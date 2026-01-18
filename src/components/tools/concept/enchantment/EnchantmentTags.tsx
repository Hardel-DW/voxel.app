import { Identifier } from "@voxelio/breeze";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useElementLocks } from "@/lib/hook/useBreezeElement";
import { useRenderer } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { cn } from "@/lib/utils";
import type { Condition, Lock } from "@/lib/utils/lock";
import { TagsEnchantmentAction, type TagsEnchantmentActionProps } from "./TagsEnchantmentAction";

export type EnchantmentTagsProps = {
    title: string;
    description: string;
    image?: string;
    values: string[];
    hide?: Condition;
    lock?: Lock[];
    elementId?: string;
    actions?: TagsEnchantmentActionProps[];
};

const maxDisplayValues = 3;
export default function EnchantmentTags(props: EnchantmentTagsProps) {
    const t = useTranslate();
    const currentElementId = useNavigationStore((state) => props.elementId ?? state.currentElementId);
    const lock = useElementLocks(props.lock, currentElementId);
    const isInList = useRenderer<boolean>(props.actions?.[1]?.renderer, props.elementId);
    const targetValue = useRenderer<boolean>(props.actions?.[0]?.renderer, props.elementId);
    const currentIdentifier = currentElementId ? Identifier.fromUniqueKey(currentElementId).toString() : null;
    const displayValues =
        currentIdentifier && isInList && !props.values.includes(currentIdentifier) ? [...props.values, currentIdentifier] : props.values;

    return (
        <RenderGuard condition={props.hide}>
            <div
                className={cn(
                    "bg-black/35 border border-zinc-900 transition-transform duration-150 ease-out hover:-translate-y-1 px-6 py-4 rounded-xl relative overflow-hidden w-full h-full text-left flex flex-col justify-between isolate",
                    lock.isLocked && "opacity-50 ring-1 ring-zinc-700",
                    targetValue && "ring-1 ring-zinc-600"
                )}>
                {isInList && (
                    <span className="absolute top-2 right-2">
                        <img src="/icons/star.svg" alt="In list" className="w-4 h-4 invert" />
                    </span>
                )}
                <div className="flex flex-col flex-1">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-4">
                            {props.image && (
                                <div className="shrink-0">
                                    <img src={props.image} alt="Icon" className="w-8 h-8 object-contain pixelated" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-white line-clamp-1">{t(props.title)}</span>
                                <span className="text-xs text-zinc-400 font-light line-clamp-2">{t(props.description)}</span>
                            </div>
                        </div>
                    </div>

                    {displayValues.length > 0 && (
                        <>
                            <hr className="border-zinc-700 my-2" />
                            <div className="grid gap-1">
                                {displayValues
                                    .slice(0, displayValues.length <= maxDisplayValues ? displayValues.length : maxDisplayValues)
                                    .map((val) => (
                                        <span
                                            key={val}
                                            className="text-zinc-400 tracking-tighter text-xs px-2 bg-zinc-900/20 py-0.5 rounded-md border border-zinc-900">
                                            {Identifier.of(val, "minecraft").toResourceName()}
                                        </span>
                                    ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div>
                        {displayValues.length > maxDisplayValues && (
                            <Popover>
                                <PopoverTrigger>
                                    <span className="text-zinc-400 text-xs px-2 pt-2 hover:text-zinc-200 cursor-pointer transition-colors">
                                        {t("generic.see.more")} ({displayValues.length - maxDisplayValues})
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-xs">
                                    <div className="grid gap-1">
                                        {displayValues.slice(maxDisplayValues).map((val) => (
                                            <span
                                                key={val}
                                                className="text-zinc-400 tracking-tighter text-xs px-2 bg-zinc-900/20 py-0.5 rounded-md border border-zinc-900">
                                                {Identifier.of(val, "minecraft").toResourceName()}
                                            </span>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div>
                        {props.actions && props.actions.length > 0 && (
                            <Popover>
                                <PopoverTrigger>
                                    <Button
                                        variant="ghost_border"
                                        size="xs"
                                        className="rounded-md text-zinc-400 text-xs px-3 py-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}>
                                        {t("generic.actions")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="max-w-80">
                                    <div className="space-y-2">
                                        <TagsEnchantmentAction
                                            {...props.actions[0]}
                                            elementId={props.elementId}
                                            lock={lock}
                                            key={`target-${targetValue}`}
                                        />
                                        <TagsEnchantmentAction
                                            {...props.actions[1]}
                                            elementId={props.elementId}
                                            lock={lock}
                                            key={`membership-${isInList}`}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
                </div>
            </div>
        </RenderGuard>
    );
}
