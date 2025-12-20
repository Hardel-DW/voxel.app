import { useQuery } from "@tanstack/react-query";
import { getMinecraftVersion, PACK_VERSION } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import { fetchMcmetaData, MCMETA_PATH } from "@/lib/github/mcmeta";

export type FetchedRegistry<T> = Record<string, T>;
export type Component<T> = Record<string, T>;

function buildVersionTag(packFormat: number | null, type: keyof typeof MCMETA_PATH): string {
    if (!packFormat) return MCMETA_PATH[type].branch;
    const formatKey = packFormat.toString() as keyof typeof PACK_VERSION;
    const effectiveFormat = formatKey in PACK_VERSION ? packFormat : Math.max(...Object.keys(PACK_VERSION).map(Number));
    return `${getMinecraftVersion(effectiveFormat)}-${MCMETA_PATH[type].branch}`;
}

export default function useRegistry<T>(type: keyof typeof MCMETA_PATH, registryId?: string) {
    const packFormat = useConfiguratorStore((state) => state.version);
    const versionTag = buildVersionTag(packFormat, type);
    const registryQueryKey = ["registry", registryId, versionTag];
    const {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    } = useQuery<T, Error>({
        queryKey: registryQueryKey,
        queryFn: () => fetchMcmetaData(type, versionTag, registryId) as T
    });

    return {
        data: registryData,
        isLoading: isRegistryLoading,
        isError: isRegistryError
    };
}
