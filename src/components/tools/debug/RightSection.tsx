import { CodeSection } from "@/components/tools/debug/CodeSection";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import { t } from "@/lib/i18n";

interface RightSectionProps {
    uniqueKey: string | undefined;
}

export function RightSection({ uniqueKey }: RightSectionProps) {
    const { name, version } = useConfiguratorStore.getState();
    const { closeDebugModal } = useDebugStore();

    const calculateStoreSize = () => {
        const store = useConfiguratorStore.getState();
        const storeSizeBytes = new TextEncoder().encode(JSON.stringify(store)).length;
        const storeSizeKB = (storeSizeBytes / 1024).toFixed(2);
        const storeSizeMB = (storeSizeBytes / (1024 * 1024)).toFixed(2);
        return `${storeSizeKB} KB (${storeSizeMB} MB)`;
    };

    return (
        <div className="h-full pt-12 relative flex flex-col min-h-0">
            <div className="absolute top-0 left-0 px-2">
                <p className="text-zinc-400">{name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-zinc-500">
                        {t("debug.pack_version")} - {version}
                    </p>
                    <p className="text-xs text-zinc-600">
                        {t("settings.store_size")} {calculateStoreSize()}
                    </p>
                </div>
            </div>
            <button
                className="absolute cursor-pointer top-1 right-0 rounded-xl text-zinc-500 hover:text-zinc-200 transition-colors bg-zinc-950/10 px-2 py-1 border-zinc-950"
                type="button"
                onClick={closeDebugModal}>
                {t("debug.leave")}
            </button>
            <div className="flex-1 min-h-0">
                <CodeSection uniqueKey={uniqueKey} />
            </div>
        </div>
    );
}
