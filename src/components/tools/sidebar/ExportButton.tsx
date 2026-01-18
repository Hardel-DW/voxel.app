import { DatapackDownloader } from "@voxelio/breeze";
import { convertDatapack, extractMetadata, ModPlatforms } from "@voxelio/converter";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { downloadFile } from "@/lib/utils/download";

const MOD_MANIFEST_FILES = ["fabric.mod.json", "quilt.mod.json", "META-INF/mods.toml", "META-INF/neoforge.mods.toml"];
function hasModManifest(files: Record<string, Uint8Array>): boolean {
    return MOD_MANIFEST_FILES.some((manifest) => manifest in files);
}

export default function ExportButton() {
    const t = useTranslate();
    const isModded = useConfiguratorStore((state) => state.isModded);
    const setIsModded = useConfiguratorStore((state) => state.setIsModded);

    const handleDownload = async () => {
        const { logger, isModded, compile, name, files } = useConfiguratorStore.getState();
        const response = await compile().generate(logger, isModded);
        const outputName = DatapackDownloader.getFileName(name, isModded);

        if (isModded && !hasModManifest(files)) {
            const blob = await response.blob();
            const zipFile = new File([blob], `${name}.zip`, { type: "application/zip" });
            const metadata = await extractMetadata(zipFile, name);
            const platforms = [ModPlatforms.FORGE, ModPlatforms.FABRIC, ModPlatforms.QUILT, ModPlatforms.NEOFORGE];
            const converted = await convertDatapack(zipFile, platforms, metadata);
            if (converted) {
                downloadFile(await converted.blob(), outputName);
                return;
            }
        }

        downloadFile(response, outputName);
    };

    return (
        <Dialog id="export-dialog">
            <DialogTrigger className="size-10 in-data-pinned:w-full in-data-pinned:flex-1">
                <Button
                    type="button"
                    className="size-full p-0 in-data-pinned:w-full in-data-pinned:items-center in-data-pinned:gap-2"
                    variant="shimmer"
                    size="default">
                    <img src="/icons/upload.svg" alt="Export" className="size-5 block in-data-pinned:hidden" />
                    <span className="text-sm hidden in-data-pinned:block whitespace-nowrap">{t("export")}</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-xl min-w-0 bg-zinc-950 border border-zinc-800 p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="mb-3">
                        <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner">
                            <img src="/icons/upload.svg" alt="Export" className="size-5 opacity-75" />
                        </div>
                        <span className="text-zinc-100 font-semibold tracking-tight">{t("export")}</span>
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-sm">{t("export.description")}</DialogDescription>
                </DialogHeader>

                <DialogBody className="p-6 space-y-8">
                    <div className="space-y-3">
                        <label htmlFor="format" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                            {t("export.format")}
                        </label>
                        <ToggleGroup value={isModded ? "jar" : "zip"} onChange={(v) => setIsModded(v === "jar")}>
                            <ToggleGroupOption value="zip" className="flex flex-col items-center gap-4">
                                <div className="size-8 rounded-full border border-zinc-700 flex items-center justify-center">
                                    <img src="/icons/folder.svg" className="size-4 opacity-50" alt="Datapack" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-zinc-300 font-medium">{t("export.format.datapack")}</span>
                                    <span className="text-zinc-500 text-xs font-mono">{t("export.format.datapack.extension")}</span>
                                </div>
                            </ToggleGroupOption>
                            <ToggleGroupOption value="jar" className="flex flex-col items-center gap-4">
                                <div className="size-8 rounded-full border border-zinc-700 flex items-center justify-center">
                                    <img src="/icons/tools/weight.svg" className="size-4 invert opacity-50" alt="Mod" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-zinc-300 font-medium">{t("export.format.mod")}</span>
                                    <span className="text-zinc-500 text-xs font-mono">{t("export.format.mod.extension")}</span>
                                </div>
                            </ToggleGroupOption>
                        </ToggleGroup>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />

                    <div className="flex flex-col gap-3">
                        <label htmlFor="support" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1 text-center">
                            {t("export.support.title")}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="https://discord.gg/TAmVFvkHep"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-4 h-10 rounded-lg bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 border border-[#5865F2]/20 transition-all font-medium text-sm">
                                {t("export.support.discord")}
                            </a>
                            <a
                                href="https://www.patreon.com/hardel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-4 h-10 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 transition-all font-medium text-sm">
                                {t("export.support.patreon")}
                            </a>
                        </div>
                    </div>
                    <div className="h-px w-full bg-zinc-800/50" />
                    <DialogCloseButton
                        type="button"
                        className="w-full h-14 bg-zinc-100 text-zinc-950 font-bold hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-white/5"
                        onClick={handleDownload}>
                        <div className="flex items-center gap-3">
                            <span className="text-base tracking-wide">{t("export.download")}</span>
                            <img src="/icons/download.svg" alt="download" className="size-5" />
                        </div>
                    </DialogCloseButton>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
