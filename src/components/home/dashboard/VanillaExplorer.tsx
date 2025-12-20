import { useNavigate } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { t } from "@/lib/i18n";

interface VersionOption {
    version: number;
    label: string;
    mcVersion: string;
}

const VERSIONS: VersionOption[] = [
    { version: 88, label: "1.21.10", mcVersion: "Snapshot" },
    { version: 61, label: "1.21.4", mcVersion: "Latest" },
    { version: 57, label: "1.21.2-3", mcVersion: "Stable" },
    { version: 48, label: "1.21-1", mcVersion: "Stable" }
];

export default function VanillaExplorer() {
    const navigate = useNavigate();

    const handleVanillaImport = (version: number) => {
        const mcmeta = { pack: { pack_format: version, description: "Vanilla Minecraft - Voxel Studio" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const elements = new Map();
        const logger = new Logger(files);

        useConfiguratorStore.getState().setup({ files, elements, version, logger }, false, "Vanilla Minecraft");
        navigate({ to: "/editor/enchantment/overview" });
    };

    return (
        <div className="flex-1 flex flex-col rounded-2xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden">
            <div className="p-5 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <svg className="size-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-200">{t("studio.vanilla_explorer")}</h3>
                        <p className="text-xs text-zinc-500">{t("studio.vanilla_explorer.description")}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
                {VERSIONS.map((v) => (
                    <button
                        key={v.version}
                        type="button"
                        onClick={() => handleVanillaImport(v.version)}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-pointer text-left">
                        <div className="size-9 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50 group-hover:border-zinc-600/50 transition-colors">
                            <span className="text-xs font-mono text-zinc-400">{v.version}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                Minecraft {v.label}
                            </p>
                            <p className="text-xs text-zinc-600">{v.mcVersion}</p>
                        </div>
                        <svg className="size-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );
}
