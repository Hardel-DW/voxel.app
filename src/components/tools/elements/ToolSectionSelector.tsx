import { useSearch } from "@tanstack/react-router";
import type React from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { BaseComponent } from "@/lib/hook/useBreezeElement";
import { cn } from "@/lib/utils";

export type ToolSectionSelectorSection = BaseComponent & {
    id: string;
    title: string;
    children: React.ReactNode;
    elements: {
        id: string;
        title: string;
    }[];
    value?: string;
    setValue?: (value: string) => void;
    searchParam?: string;
    useUrlSync?: boolean;
    defaultValue?: string;
};

export default function ToolSectionSelector(props: ToolSectionSelectorSection) {
    const search = useSearch({ from: "/$lang/studio/editor" }) as Record<string, string | undefined>;
    const urlValue = props.searchParam && props.useUrlSync ? search[props.searchParam] : null;
    const currentValue = urlValue || props.value || props.defaultValue || props.elements?.[0]?.id || "";

    const handleSetValue = (value: string) => {
        props.setValue?.(value);
    };

    return (
        <RenderGuard condition={props.hide}>
            <div className="not-first:mt-16 h-full">
                <div className="flex flex-col ring-0 transition-all h-full">
                    <div className="py-2 px-2 gap-4 flex flex-wrap justify-between items-center cursor-pointer shrink-0">
                        <div className="relative">
                            <h2 className="text-2xl font-semibold">{props.title}</h2>
                            <hr className="m-0 absolute -bottom-2 left-0 right-0" />
                        </div>
                        {props.elements && (
                            <div className="flex gap-x-2 py-2 px-2 items-center rounded-2xl p-1 bg-black/35 border border-zinc-900 shrink-0 relative overflow-hidden isolate">
                                {props.elements.map((element) => (
                                    <button
                                        type="button"
                                        className={cn("px-4 py-2 rounded-xl text-left cursor-pointer", {
                                            "bg-zinc-300 text-zinc-900": currentValue === element.id,
                                            "hover:bg-zinc-900": currentValue !== element.id
                                        })}
                                        key={element.id}
                                        onClick={() => handleSetValue(element.id)}>
                                        <p className="font-semibold line-clamp-1 text-xs md:text-sm">{element.title}</p>
                                    </button>
                                ))}

                                <div className="absolute inset-0 -z-10 brightness-15">
                                    <img src="/images/shine.avif" alt="Shine" loading="lazy" className="h-1/2 w-full" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="transition-height duration-100 ease-in-out h-full">
                        <div className="pt-4 gap-4 flex items flex-col h-full">{props.children}</div>
                    </div>
                </div>
            </div>
        </RenderGuard>
    );
}
