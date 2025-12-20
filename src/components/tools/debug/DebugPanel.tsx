import { useEffect } from "react";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { RegistryElement } from "@/components/tools/debug/RegistryElement";
import { RightSection } from "@/components/tools/debug/RightSection";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { TextInput } from "@/components/ui/TextInput";
import { ruwsc } from "@/lib/utils/text";
import { useConfiguratorStore } from "../Store";

export default function DebugPanel() {
    const {
        selectedElement,
        selectedRegistry,
        registries,
        search,
        isDebugModalOpen,
        setSearch,
        setSelectedRegistry,
        setSelectedElement,
        getFilteredElements,
        closeDebugModal
    } = useDebugStore();

    useEffect(() => {
        if (!isDebugModalOpen) return;
        const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && closeDebugModal();
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isDebugModalOpen, closeDebugModal]);

    if (!isDebugModalOpen) return null;

    const filteredElements = getFilteredElements();
    const showStoreData = () => {
        const store = useConfiguratorStore.getState();
        console.debug(store);
    };

    return (
        <div className="fixed border-zinc-800 border-t border-l bg-header-translucent backdrop-blur-xl rounded-2xl inset-4 p-8 z-200 flex flex-col starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity]">
            <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
                <div className="flex flex-col gap-4 min-h-0">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 shrink-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="z-10">
                                    <Button variant="ghost" className="min-w-[150px] justify-between hover:bg-white/5 hover:text-zinc-200">
                                        {ruwsc(selectedRegistry)}
                                        <img src="/icons/chevron-down.svg" alt="Chevron Down" className="w-4 h-4 invert" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="z-100">
                                    {registries.map((registry) => (
                                        <DropdownMenuItem key={registry} onClick={() => setSelectedRegistry(registry)}>
                                            {ruwsc(registry)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <img
                                src="/icons/debug.svg"
                                alt="Search"
                                className="w-4 h-4 invert-50 hover:invert-100 transition-colors cursor-pointer"
                                onClick={showStoreData}
                            />
                            <TextInput placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4 auto-rows-min">
                            {filteredElements.map((uniqueKey) => (
                                <RegistryElement
                                    key={uniqueKey}
                                    uniqueKey={uniqueKey}
                                    selectedElement={selectedElement}
                                    onElementSelect={setSelectedElement}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <RightSection uniqueKey={selectedElement} />
            </div>
        </div>
    );
}
