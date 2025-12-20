import { type DataDrivenElement, type DataDrivenRegistryElement, Identifier } from "@voxelio/breeze";
import type { FetchedRegistry } from "@/lib/hook/useRegistry";

/**
 * Merges vanilla registry (FetchedRegistry) with user datapack registry (DataDrivenRegistryElement[])
 * by their identifiers, avoiding duplicates. User datapack entries take precedence over vanilla.
 */
export function mergeRegistries<T extends DataDrivenElement>(
    vanillaRegistry: FetchedRegistry<T> | undefined,
    userRegistry: DataDrivenRegistryElement<T>[],
    registryType: string
): DataDrivenRegistryElement<T>[] {
    if (!vanillaRegistry) throw new Error("Vanilla registry is undefined");
    const merged = new Map<string, DataDrivenRegistryElement<T>>();

    for (const [id, data] of Object.entries(vanillaRegistry)) {
        const identifier = Identifier.of(id, registryType);
        merged.set(identifier.toString(), { identifier, data });
    }

    for (const element of userRegistry) {
        merged.set(new Identifier(element.identifier).toString(), element);
    }

    return Array.from(merged.values());
}
