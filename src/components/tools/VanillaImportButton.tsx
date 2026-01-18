import { useNavigate, useParams } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export default function VanillaImportButton() {
    const t = useTranslate();
    const navigate = useNavigate();
    const { lang } = useParams({ from: "/$lang" });

    const handleVanillaImport = async (version: number) => {
        const mcmeta = { pack: { pack_format: version, description: "No Description, please change this - Voxel Configurator" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const elements = new Map();
        const logger = new Logger(files);

        useConfiguratorStore.getState().setup({ files, elements, version, logger }, false, "Change This Name - Voxel Configurator");
        navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button disabled variant="default">
                    {t("studio.import_vanilla.disabled")}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleVanillaImport(88)}>Minecraft - Version 1.21.10</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(61)}>Minecraft - Version 1.21.4</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(57)}>Minecraft - Version 1.21.2 to 1.21.3</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleVanillaImport(48)}>Minecraft - Version 1.21 to 1.21.1</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
