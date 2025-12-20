import { useState } from "react";
import ButtonCopy from "@/components/ui/codeblock/ButtonCopy";
import ButtonDownload from "@/components/ui/codeblock/ButtonDownload";
import HighlightSection from "@/components/ui/codeblock/HighlightSection";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Dropdown";

type Tabs = Record<string, { title: string; description: string }>;

export default function CodeBlock(props: {
    children: string;
    title?: string;
    className?: string;
    language: string;
    tabs?: Tabs;
    defaultTab?: string;
    onTabChange?: (tab: string) => void;
}) {
    const [selectedTab, setSelectedTab] = useState<string | undefined>(props.defaultTab || Object.keys(props.tabs || {})[0]);

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
        props.onTabChange?.(tab);
    };

    return (
        <div className={cn("relative w-full h-full py-4 pl-4 pr-px bg-zinc-950/20 rounded-2xl border-zinc-800 border", props.className)}>
            <div className="absolute z-10 top-0 right-0 m-4">
                <div className="flex flex-col gap-y-4">
                    <ButtonCopy snippet={props.children} />
                    <ButtonDownload snippet={props.children} />
                </div>
            </div>
            <div className="relative flex h-4">
                <div className="flex items-center z-10 gap-x-2 group">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />

                    {props.tabs && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="items-center text-xs text-zinc-500 font-mono ml-2 group-hover:text-zinc-200 transition-colors cursor-pointer">
                                <span className="flex items-center gap-x-1 leading-none">
                                    {selectedTab && props.tabs?.[selectedTab]?.title}
                                    <img
                                        src="/icons/chevron-down.svg"
                                        alt="Chevron Down"
                                        className="w-2 h-2 invert-50 group-hover:invert-100 transition-colors"
                                    />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.keys(props.tabs).map((tab) => (
                                    <DropdownMenuItem key={tab} onClick={() => handleTabChange(tab)}>
                                        <div className="flex flex-col">
                                            <span>{props.tabs?.[tab]?.title}</span>
                                            <span className="text-[10px] text-zinc-500">{props.tabs?.[tab]?.description}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                {props.title && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium z-20 text-ellipsis whitespace-nowrap">
                        <span className="text-secondary">{props.title}</span>
                    </div>
                )}
            </div>
            <div className="overflow-auto h-full w-full z-10">
                <div className="h-auto text-white pt-4 bg-transparent border-none text-base relative overflow-hidden">
                    <HighlightSection language={props.language}>{props.children}</HighlightSection>
                </div>
            </div>
        </div>
    );
}
