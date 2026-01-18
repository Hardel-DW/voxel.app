import Internalization from "@/components/tools/Internalization";
import ExportButton from "@/components/tools/sidebar/ExportButton";
import GitButton from "@/components/tools/sidebar/GitButton";
import SidebarCard from "@/components/tools/sidebar/SidebarCard";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { CONCEPTS } from "@/lib/data/elements";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export default function StudioSidebar() {
    const t = useTranslate();
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    if (!hasElements) return null;

    return (
        <div className="flex flex-col pb-4 size-full">
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin flex flex-col items-center">
                <div className="flex flex-col gap-3 mt-4 w-full max-w-[280px] mx-auto">
                    {CONCEPTS.map((concept) => (
                        <SidebarCard key={concept.registry} image={concept.image} registry={concept.registry} overview={concept.overview} />
                    ))}
                </div>
            </div>

            <div className="shrink-0 flex flex-col-reverse items-center gap-2 mt-2 transition-all duration-300 w-full justify-center max-w-[280px] mx-auto">
                <ExportButton />
                <GitButton />
                <Dialog id="settings-dialog">
                    <DialogTrigger>
                        <Button type="button" variant="transparent" size="square" className="border-0 select-none aspect-square shrink-0">
                            <img src="/icons/settings.svg" alt="settings" className="size-6 invert opacity-70" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0">
                        <DialogHeader className="px-6 pt-6 pb-2">
                            <DialogTitle className="mb-3">
                                <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                                    <img src="/icons/settings.svg" alt="Settings" className="size-5 invert opacity-75" />
                                </div>
                                <span className="text-zinc-100 font-semibold tracking-tight">{t("settings")}</span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-sm">{t("settings.description")}</DialogDescription>
                        </DialogHeader>

                        <DialogBody className="p-6 pt-2 space-y-6">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 ml-1">
                                        {t("settings.language")}
                                    </h4>
                                    <div className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-zinc-200">{t("settings.language")}</span>
                                            <span className="text-xs text-zinc-500">{t("settings.language.description")}</span>
                                        </div>
                                        <Internalization />
                                    </div>
                                </div>
                            </div>
                        </DialogBody>
                        <div className="absolute top-0 right-0 w-full h-32 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
