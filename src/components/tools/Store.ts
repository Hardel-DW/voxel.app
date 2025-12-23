import type { Action, ActionValue, Analysers, DataDrivenElement, DataDrivenRegistryElement, GetAnalyserVoxel, ParseDatapackResult } from "@voxelio/breeze";
import { Datapack } from "@voxelio/breeze";
import { compileDatapack, Identifier, isVoxelElement, Logger, sortElementsByRegistry, updateData } from "@voxelio/breeze";
import { create } from "zustand";
import { useHomeStore } from "@/components/home/HomeStore";
import { loadDatapackFromFolder, loadDatapackFromPath } from "@/lib/utils/datapack";
import { encodeFilesRecord } from "@/lib/utils/encode";
import { saveSession, updateSessionData, updateSessionLogger } from "@/lib/utils/sessionPersistence";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";
import type { CONCEPT_KEY } from "@/components/tools/elements";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";

export type RegistrySearchOptions = {
    path?: string;
    excludeNamespaces?: string[];
};

export type SourceType = "zip" | "jar" | "folder";

export interface SourceMetadata {
    path: string;
    type: SourceType;
}

export interface OpenTab {
    elementId: string;
    route: string;
    label: string;
}

const MAX_HISTORY_SIZE = 20;
const MAX_TABS = 10;

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
    navigationHistory: string[];
    navigationIndex: number;
    // Tabs system
    openTabs: OpenTab[];
    activeTabIndex: number;
    // Source tracking
    sourceMetadata: SourceMetadata | null;
    isDirty: boolean;
    // Navigation actions
    goto: (id: string) => void;
    back: () => void;
    forward: () => void;
    // Tab actions
    openTab: (elementId: string, route: string, label: string) => void;
    closeTab: (index: number) => void;
    switchTab: (index: number) => void;
    // File actions
    addFile: (key: string, value: Uint8Array) => void;
    getSortedIdentifiers: (registry: string) => string[];
    setName: (name: string) => void;
    setCurrentElementId: (id: string | null) => void;
    setIsModded: (isModded: boolean) => void;
    handleChange: (action: Action, identifier?: string, value?: ActionValue) => void;
    setup: (updates: ParseDatapackResult<GetAnalyserVoxel<T>>, isModded: boolean, name: string, source?: SourceMetadata) => void;
    compile: () => Datapack;
    getLengthByRegistry: (registry: string) => number;
    getConcept: (pathname: string) => CONCEPT_KEY | null;
    getRegistry: <R extends DataDrivenElement>(registry: string, options?: RegistrySearchOptions) => DataDrivenRegistryElement<R>[];
    createNewProject: () => void;
    // Dirty state
    markDirty: () => void;
    markClean: () => void;
    setSourceMetadata: (source: SourceMetadata | null) => void;
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
        // Tabs
        openTabs: [],
        activeTabIndex: -1,
        // Source
        sourceMetadata: null,
        isDirty: false,
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
        openTab: (elementId, route, label) => {
            const { openTabs } = get();
            const existingIndex = openTabs.findIndex((tab) => tab.elementId === elementId);
            if (existingIndex !== -1) {
                set({ activeTabIndex: existingIndex, currentElementId: elementId });
                return;
            }
            const newTab: OpenTab = { elementId, route, label };
            const updatedTabs = [...openTabs, newTab].slice(-MAX_TABS);
            set({ openTabs: updatedTabs, activeTabIndex: updatedTabs.length - 1, currentElementId: elementId });
        },
        closeTab: (index) => {
            const { openTabs, activeTabIndex } = get();
            if (index < 0 || index >= openTabs.length) return;
            const updatedTabs = openTabs.toSpliced(index, 1);
            if (updatedTabs.length === 0) {
                set({ openTabs: [], activeTabIndex: -1, currentElementId: null });
                return;
            }

            const newActiveIndex = index === activeTabIndex
                ? Math.min(index, updatedTabs.length - 1)
                : index < activeTabIndex ? activeTabIndex - 1 : activeTabIndex;

            const newCurrentElement = updatedTabs[newActiveIndex]?.elementId ?? null;
            set({ openTabs: updatedTabs, activeTabIndex: newActiveIndex, currentElementId: newCurrentElement });
        },
        switchTab: (index) => {
            const { openTabs } = get();
            if (index < 0 || index >= openTabs.length) return;
            const tab = openTabs[index];
            set({ activeTabIndex: index, currentElementId: tab.elementId });
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
            set((s) => ({ elements: s.elements.set(elementId, updatedElement), registryCache: new Map(), isDirty: true }));
            updateSessionLogger(state.logger);
        },
        setup: (updates, isModded, name, source) => {
            set({
                ...updates,
                sortedIdentifiers: sortElementsByRegistry(updates.elements),
                isModded,
                name,
                sourceMetadata: source ?? null,
                isDirty: false,
                openTabs: [],
                activeTabIndex: -1
            });
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
            if (pathParts.length >= 1 && pathParts[0] === "editor") {
                return pathParts[1] as CONCEPT_KEY;
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
        },
        createNewProject: () => {
            const mcmeta = { pack: { pack_format: 61, description: "New Voxel Project" } };
            const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
            const logger = new Logger(files);
            get().setup({ files, elements: new Map(), version: 61, logger }, false, "New Project");
        },
        markDirty: () => set({ isDirty: true }),
        markClean: () => set({ isDirty: false }),
        setSourceMetadata: (source) => set({ sourceMetadata: source })
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


export const openDatapackFromPath = async (path: string, onSuccess: () => void) => {
    try {
        const isDir = !path.endsWith(".zip") && !path.endsWith(".jar");
        const { datapack, name, isModded, iconPath } = isDir
            ? await loadDatapackFromFolder(path)
            : await loadDatapackFromPath(path);

        const sourceType: SourceType = isDir ? "folder" : isModded ? "jar" : "zip";
        const projectType = isDir ? "folder" : isModded ? "mods" : "datapacks";
        const sourceMetadata: SourceMetadata = { path, type: sourceType };
        useConfiguratorStore.getState().setup(datapack, isModded, name, sourceMetadata);
        useHomeStore.getState().addRecentProject({ name, path, type: projectType, icon: iconPath ?? undefined });
        onSuccess();
        toast(t("studio.success.loaded", { file: name }), TOAST.SUCCESS);
    } catch (e: unknown) {
        console.error("[openDatapackFromPath] Error:", e);
        toast(t("generic.dialog.error"), TOAST.ERROR, e instanceof Error ? e.message : t("studio.error.failed_to_upload"));
    }
};