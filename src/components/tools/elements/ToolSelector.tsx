import RenderGuard from "@/components/tools/elements/RenderGuard";
import { Tab, TabList, Tabs } from "@/components/ui/Tabs";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";

export type ToolSelectorType = BaseInteractiveComponent & {
    title: string;
    description: string;
    options: { label: string; value: string }[];
};

export default function ToolSelector(props: ToolSelectorType & { index?: number }) {
    const { value, lock, handleChange } = useInteractiveLogic<ToolSelectorType, string>({ component: props });
    if (value === null) return null;

    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/35 border border-zinc-900 cursor-pointer relative overflow-hidden transition-transform duration-150 ease-out hover:-translate-y-1 p-6 rounded-xl isolate">
                <div className="flex flex-col gap-4 h-full px-6">
                    <div className="flex justify-between items-center w-full gap-4">
                        <div className="flex flex-col flex-1">
                            <span className="text-white line-clamp-1">{props.title}</span>
                            <span className="text-xs text-zinc-400 font-light line-clamp-2">
                                {lock.isLocked ? lock.text : props.description}
                            </span>
                        </div>
                        <Tabs value={value} onChange={handleChange}>
                            <TabList>
                                {props.options.map((opt) => (
                                    <Tab key={opt.value} value={opt.value} disabled={lock.isLocked}>
                                        {opt.label}
                                    </Tab>
                                ))}
                            </TabList>
                        </Tabs>
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
                </div>
            </div>
        </RenderGuard>
    );
}
