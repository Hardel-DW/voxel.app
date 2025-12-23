import { useRef } from "react";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import ExportButton from "@/components/tools/sidebar/export/ExportButton";
import SidebarCard from "@/components/tools/sidebar/SidebarCard";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Switch } from "@/components/ui/Switch";
import { useLocalStorage } from "@/lib/hook/useLocalStorage";
import Internalization from "../Internalization";

export default function StudioSidebar() {
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    const buttonsContainerRef = useRef<HTMLDivElement>(null);
    const [disableEffects, setDisableEffects] = useLocalStorage("studio:disable-effects", false);
    if (!hasElements) return null;

    const handleDebugModalOpen = () => {
        const { openDebugModal } = useDebugStore.getState();
        const compiledDatapack = useConfiguratorStore.getState().compile();
        openDebugModal(compiledDatapack);
    };

    return (
        <div className="flex flex-col pb-4 size-full">
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin flex flex-col items-center">
                <div className="flex flex-col gap-3 mt-4 w-full max-w-[280px] mx-auto">
                    {CONCEPTS.map((concept) => (
                        <SidebarCard key={concept.registry} image={concept.image} registry={concept.registry} overview={concept.overview} />
                    ))}
                </div>
            </div>

            <div
                ref={buttonsContainerRef}
                className="shrink-0 flex flex-col-reverse items-center gap-2 mt-2 transition-all duration-300 w-full justify-center max-w-[280px] mx-auto">
                <ExportButton containerRef={buttonsContainerRef} />
                <Popover>
                    <PopoverTrigger>
                        <Button type="button" variant="transparent" size="square" className="border-0 select-none aspect-square shrink-0">
                            <img src="/icons/settings.svg" alt="settings" className="size-6 invert opacity-70" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        containerRef={buttonsContainerRef}
                        spacing={20}
                        className="w-80 p-2 flex flex-col bg-zinc-950 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl">
                        <div className="flex flex-col p-2 gap-1 relative">
                            <div className="absolute inset-0 -z-10 brightness-25 blur-lg rounded-xl overflow-hidden">
                                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="px-3 py-2">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Settings</span>
                            </div>

                            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                        Effects
                                    </span>
                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        Disable background animations
                                    </span>
                                </div>
                                <Switch isChecked={disableEffects ?? true} setIsChecked={setDisableEffects} />
                            </div>

                            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                        Language
                                    </span>
                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                        Change the language of the application
                                    </span>
                                </div>
                                <Internalization />
                            </div>
                        </div>

                        <div className="mx-4 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                        <div className="p-2">
                            <Button
                                variant="ghost"
                                onClick={handleDebugModalOpen}
                                className="w-full justify-between h-auto py-3 px-4 font-normal text-zinc-400 hover:text-white bg-zinc-900/10 hover:bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200 group">
                                <span className="flex items-center gap-3">
                                    <img
                                        src="/icons/debug.svg"
                                        alt="Code"
                                        className="size-4 invert opacity-50 group-hover:opacity-100 transition-opacity"
                                    />
                                    <span className="font-medium text-xs">Open Code Viewer</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                        JSON
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
