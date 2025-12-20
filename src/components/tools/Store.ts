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
import { encodeFilesRecord } from "@/lib/utils/encode";
import { saveSession, updateSessionData, updateSessionLogger } from "@/lib/utils/sessionPersistence";
import type { CONCEPT_KEY } from "./elements";
import { useExportStore } from "./sidebar/ExportStore";

export type RegistrySearchOptions = {
    path?: string;
    excludeNamespaces?: string[];
};

const MAX_HISTORY_SIZE = 20;

export interface ConfiguratorState<T extends keyof Analysers> {
    name: string;
    logger?: Logger;
    files: Record<string, Uint8Array>;
    elements: Map<string, GetAnalyserVoxel<T>>;
    currentElementId?: string | null;
    isModded: boolean;
    version: number | null;
    sortedIdentifiers: Map<string, string[]>;
    registryCache: Map<string, DataDrivenRegistryElement<any>[]>;
    custom: Map<string, Uint8Array>;
    // Navigation
    navigationHistory: string[];
    navigationIndex: number;
    goto: (id: string) => void;
    back: () => void;
    forward: () => void;
    // Actions
    addFile: (key: string, value: Uint8Array) => void;
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setCurrentElementId: (id: string | null) => void;
    setIsModded: (isModded: boolean) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>, isModded: boolean, name: string) => void;
    compile: () => Datapack;
    getLengthByRegistry: (registry: string) => number;
    getConcept: (pathname: string) => CONCEPT_KEY | null;
    getRegistry: <R extends DataDrivenElement>(registry: string, options?: RegistrySearchOptions) => DataDrivenRegistryElement<R>[];
}

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
        navigationHistory: [],
        navigationIndex: -1,
        goto: (id) => {
            const { navigationHistory, navigationIndex } = get();
            const truncated = navigationHistory.slice(0, navigationIndex + 1);
            const updated = [...truncated, id].slice(-MAX_HISTORY_SIZE);
            set({ navigationHistory: updated, navigationIndex: updated.length - 1, currentElementId: id });
        },
        back: () => {
            const { navigationHistory, navigationIndex } = get();
            if (navigationIndex <= 0) return;
            const newIndex = navigationIndex - 1;
            set({ navigationIndex: newIndex, currentElementId: navigationHistory[newIndex] });
        },
        forward: () => {
            const { navigationHistory, navigationIndex } = get();
            if (navigationIndex >= navigationHistory.length - 1) return;
            const newIndex = navigationIndex + 1;
            set({ navigationIndex: newIndex, currentElementId: navigationHistory[newIndex] });
        },
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
        setCurrentElementId: (currentElementId) => set({ currentElementId }),
        setIsModded: (isModded) => {
            set({ isModded });
            updateSessionData({ isModded });
        },
        handleChange: (action, identifier) => {
            const state = get();
            const elementId = identifier ?? state.currentElementId;
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
            set({ ...updates, sortedIdentifiers: sortElementsByRegistry(updates.elements), isModded, name });
            const exportState = useExportStore.getState();
            saveSession(get(), exportState);
        },
        compile: () =>
            compileDatapack({
                elements: Array.from(get().elements.values()),
                files: get().files,
                additionnal: Object.fromEntries(get().custom)
            }),
        getLengthByRegistry: (registry) => get().getRegistry(registry).length,
        getConcept: (pathname) => {
            const pathParts = pathname.split("/").filter(Boolean);
            if (pathParts.length >= 4 && pathParts[1] === "studio" && pathParts[2] === "editor") {
                return pathParts[3] as CONCEPT_KEY;
            }
            return null;
        },
        getRegistry: <R extends DataDrivenElement>(registry: string, options?: { path?: string; excludeNamespaces?: string[] }) => {
            const cacheKey = buildCacheKey(registry, options);
            const cached = get().registryCache.get(cacheKey) as DataDrivenRegistryElement<R>[] | undefined;
            if (cached) return cached;

            const registryData = get().compile().getRegistry<R>(registry, options?.path, options?.excludeNamespaces);
            get().registryCache.set(cacheKey, registryData);
            return registryData;
        }
    }));

export const useConfiguratorStore = createConfiguratorStore();
export const getCurrentElement = <T extends keyof Analysers>(state: ConfiguratorState<T>) =>
    state.currentElementId ? state.elements.get(state.currentElementId) : undefined;

export const getModifiedElements = <T extends keyof Analysers>(state: ConfiguratorState<T>, registry: string) => {
    const changeSets = state.logger?.getChangeSets() ?? [];
    return changeSets
        .filter((c) => c.identifier.registry === registry)
        .map((c) => state.elements.get(new Identifier(c.identifier).toUniqueKey()))
        .filter((el): el is GetAnalyserVoxel<T> => !!el);
};

const buildCacheKey = (registry: string, options?: { path?: string; excludeNamespaces?: string[] }) => {
    if (!options) return registry;
    const pathKey = options.path ?? "";
    const excludeKey = options.excludeNamespaces?.length ? [...options.excludeNamespaces].sort().join(",") : "";
    return `${registry}|${pathKey}|${excludeKey}`;
};
