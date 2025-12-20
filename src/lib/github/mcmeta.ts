export const BASE_URL = "https://raw.githubusercontent.com/misode/mcmeta";
export const MCMETA_PATH = {
    component: {
        branch: "summary",
        path: "/summary/item_components",
        dataPath: "/item_components",
        gzip: true
    },
    registry: {
        branch: "registries",
        path: "/registries",
        dataPath: "",
        gzip: false
    },
    summary: {
        branch: "summary",
        path: "/summary/data",
        dataPath: "/data",
        gzip: true
    }
} as const;

export async function fetchMcmetaData(type: keyof typeof MCMETA_PATH, version: string, registry?: string): Promise<any> {
    const config = MCMETA_PATH[type];
    const { gzip, dataPath } = config;
    const registryPath = registry?.startsWith("tags/") ? registry.replace(/^tags\//, "tag/") : registry;
    const registryPathSegment = registryPath ? `/${registryPath}` : "";
    const suffix = gzip ? "/data.json.gz" : "/data.min.json";
    const url = `${BASE_URL}/${version}${dataPath}${registryPathSegment}${suffix}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Registry not found: ${response.status}`);
    }

    if (gzip && response.body) {
        return await new Response(response.body.pipeThrough(new DecompressionStream("gzip"))).json();
    }

    return await response.json();
}
