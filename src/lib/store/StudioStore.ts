import type {
    Action,
    ActionValue,
    Analysers,
    DataDrivenElement,
    DataDrivenRegistryElement,
    Datapack,
    GetAnalyserVoxel,
    ParseDatapackResult
} from "@voxelio/breeze";
import { compileDatapack, Identifier, isVoxelElement, Logger, sortElementsByRegistry, updateData } from "@voxelio/breeze";
import { create } from "zustand";
import { useGithubStore } from "@/lib/store/GithubStore";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useTabsStore } from "@/lib/store/TabsStore";
import { encodeFilesRecord } from "@/lib/utils/encode";
import { saveSession, updateSessionData, updateSessionLogger } from "@/lib/utils/sessionPersistence";

export type RegistrySearchOptions = {
    path?: string;
    excludeNamespaces?: string[];
};

export interface ConfiguratorState<T extends keyof Analysers> {
    name: string;
    logger?: Logger;
    files: Record<string, Uint8Array>;
    elements: Map<string, GetAnalyserVoxel<T>>;
    isModded: boolean;
    version: number | null;
    sortedIdentifiers: Map<string, string[]>;
    registryCache: Map<string, DataDrivenRegistryElement<any>[]>;
    custom: Map<string, Uint8Array>;
    addFile: (key: string, value: Uint8Array) => void;
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setIsModded: (isModded: boolean) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>, isModded: boolean, name: string) => void;
    compile: () => Datapack;
    getLengthByRegistry: (registry: string) => number;
    getRegistry: <R extends DataDrivenElement>(registry: string, options?: RegistrySearchOptions) => DataDrivenRegistryElement<R>[];
}

const buildCacheKey = (registry: string, options?: RegistrySearchOptions) => {
    if (!options) return registry;
    const pathKey = options.path ?? "";
    const excludeKey = options.excludeNamespaces?.length ? [...options.excludeNamespaces].sort().join(",") : "";
    return `${registry}|${pathKey}|${excludeKey}`;
};

const createConfiguratorStore = <T extends keyof Analysers>() =>
    create<ConfiguratorState<T>>((set, get) => ({
        name: "",
        logger: new Logger(),
        files: {},
        custom: new Map(),
        elements: new Map(),
        isModded: false,
        version: null,
        sortedIdentifiers: new Map(),
        registryCache: new Map(),
        addFile: (key, value) => {
            const custom = get().custom.set(key, value);
            set({ custom, registryCache: new Map() });
            updateSessionData({ files: encodeFilesRecord({ ...get().files, ...Object.fromEntries(custom) }) });
        },
        getSortedIdentifiers: (registry) => get().sortedIdentifiers.get(registry) ?? [],
        setName: (name) => {
            set({ name });
            updateSessionData({ name });
        },
        setIsModded: (isModded) => {
            set({ isModded });
            updateSessionData({ isModded });
        },
        handleChange: (action, identifier) => {
            const state = get();
            const currentElementId = useNavigationStore.getState().currentElementId;
            const elementId = identifier ?? currentElementId;
            if (!elementId) return;

            const element = state.elements.get(elementId);
            if (!element) return;

            const updatedElement = state.logger?.trackChanges(element, (el) =>
                updateData(action, el, state.version ?? Number.POSITIVE_INFINITY)
            );

            if (!updatedElement || !isVoxelElement(updatedElement)) return;
            set((state) => ({ elements: state.elements.set(elementId, updatedElement), registryCache: new Map() }));
            updateSessionLogger(state.logger);
        },
        setup: (updates, isModded, name) => {
            set({
                ...updates,
                sortedIdentifiers: sortElementsByRegistry(updates.elements),
                isModded,
                name
            });
            useTabsStore.getState().resetTabs();
            useNavigationStore.getState().resetNavigation();
            const exportState = useGithubStore.getState();
            saveSession(get(), exportState);
        },
        compile: () =>
            compileDatapack({
                elements: Array.from(get().elements.values()),
                files: get().files,
                additionnal: Object.fromEntries(get().custom)
            }),
        getLengthByRegistry: (registry) => get().getRegistry(registry).length,
        getRegistry: <R extends DataDrivenElement>(registry: string, options?: RegistrySearchOptions) => {
            const cacheKey = buildCacheKey(registry, options);
            const cached = get().registryCache.get(cacheKey) as DataDrivenRegistryElement<R>[] | undefined;
            if (cached) return cached;

            const registryData = get().compile().getRegistry<R>(registry, options?.path, options?.excludeNamespaces);
            get().registryCache.set(cacheKey, registryData);
            return registryData;
        }
    }));

export const useConfiguratorStore = createConfiguratorStore();

export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) => {
    const currentElementId = useNavigationStore.getState().currentElementId;
    return currentElementId ? state.elements.get(currentElementId) : undefined;
};

export const getModifiedElements = <T extends keyof Analysers>(state: ConfiguratorState<T>, registry: string) => {
    const changeSets = state.logger?.getChangeSets() ?? [];
    return changeSets
        .filter((c) => c.identifier.registry === registry)
        .map((c) => state.elements.get(new Identifier(c.identifier).toUniqueKey()))
        .filter((el): el is GetAnalyserVoxel<T> => !!el);
};
