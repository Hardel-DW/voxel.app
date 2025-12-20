import { DatapackDownloader } from "@voxelio/breeze";
import { convertDatapack, extractMetadata, ModPlatforms } from "@voxelio/converter";
import { useConfiguratorStore } from "@/components/tools/Store";
import SettingsDialog from "@/components/tools/sidebar/SettingsDialog";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { downloadFile } from "@/lib/utils/download";
import { t } from "@/lib/i18n";

const MOD_MANIFEST_FILES = ["fabric.mod.json", "quilt.mod.json", "META-INF/mods.toml", "META-INF/neoforge.mods.toml"];

function hasModManifest(files: Record<string, Uint8Array>): boolean {
    return MOD_MANIFEST_FILES.some((manifest) => manifest in files);
}

export default function DownloadButton() {
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
        <Dialog id="download-success-modal">
            <DialogTrigger>
                <Button type="button" variant="aurora" onClick={handleDownload}>
                    {t("export.download")}
                    <img src="/icons/download.svg" alt="download" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] p-4">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <img src="/icons/success.svg" alt="zip" className="size-6" />
                        <span className="text-xl font-medium text-zinc-200">
                            {t("success")}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        {t("modification_success")}
                        <SettingsDialog />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4 flex items-end justify-between">
                    <div>
                        <a
                            href="https://discord.gg/TAmVFvkHep"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="discord"
                            className="hover:opacity-50 transition">
                            <img src="/icons/company/discord.svg" alt="Discord" className="size-6 invert" />
                        </a>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <DialogCloseButton variant="ghost">
                            {t("close")}
                        </DialogCloseButton>
                        <Button target="_blank" rel="noopener noreferrer" href="https://streamelements.com/hardoudou/tip" variant="patreon">
                            {t("donate")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
