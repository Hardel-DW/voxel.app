import type { Analysers } from "@voxelio/breeze";
import { Logger } from "@voxelio/breeze";
import type { ConfiguratorState } from "@/components/tools/Store";
import { createLocalStorage } from "@/lib/utils/createLocalStorage";
import { decodeFilesRecord, encodeFilesRecord } from "@/lib/utils/encode";

interface SessionData {
    files: Record<string, string>;
    loggerFiles: Record<string, string>;
    name: string;
    version: number | null;
    isModded: boolean;
    isGitRepository: boolean;
    owner: string;
    repositoryName: string;
    branch: string;
    isInitializing: number | null;
    timestamp: string;
}

const SESSION_STORAGE_KEY = "voxel-studio-session";
const sessionStorage = createLocalStorage<SessionData | null>(SESSION_STORAGE_KEY, null);
export const hasSession = (): boolean => sessionStorage.getValue() !== null;
const getSessionData = (): SessionData | null => sessionStorage.getValue();

export const restoreSession = () => {
    const sessionData = getSessionData();
    if (!sessionData) return null;

    const files = decodeFilesRecord(sessionData.files);
    const loggerFiles = decodeFilesRecord(sessionData.loggerFiles);
    const logger = new Logger(loggerFiles);

    return {
        files,
        logger,
        name: sessionData.name,
        version: sessionData.version,
        isModded: sessionData.isModded,
        owner: sessionData.owner,
        repositoryName: sessionData.repositoryName,
        branch: sessionData.branch,
        isGitRepository: sessionData.isGitRepository,
        isInitializing: sessionData.isInitializing
    };
};

export const saveSession = <T extends keyof Analysers>(
    configuratorState: ConfiguratorState<T>,
    exportState: { isGitRepository: boolean; owner: string; repositoryName: string; branch: string; isInitializing: number | null }
): void => {
    const loggerEntries = configuratorState.logger?.toFileEntries() ?? [];
    const loggerFiles: Record<string, Uint8Array> = {};
    for (const entry of loggerEntries) {
        loggerFiles[entry.path] = entry.content;
    }

    const sessionData: SessionData = {
        files: encodeFilesRecord(configuratorState.files),
        loggerFiles: encodeFilesRecord(loggerFiles),
        name: configuratorState.name,
        version: configuratorState.version,
        isModded: configuratorState.isModded,
        isGitRepository: exportState.isGitRepository,
        owner: exportState.owner,
        repositoryName: exportState.repositoryName,
        branch: exportState.branch,
        isInitializing: exportState.isInitializing,
        timestamp: new Date().toISOString()
    };

    sessionStorage.setValue(sessionData);
};

export const updateSessionData = (updates: Partial<SessionData>): void => {
    const current = getSessionData();
    if (!current) return;

    const updated = { ...current, ...updates, timestamp: new Date().toISOString() };
    sessionStorage.setValue(updated);
};

export const updateSessionLogger = (logger?: Logger): void => {
    const loggerEntries = logger?.toFileEntries() ?? [];
    const loggerFiles: Record<string, Uint8Array> = {};
    for (const entry of loggerEntries) {
        loggerFiles[entry.path] = entry.content;
    }
    updateSessionData({ loggerFiles: encodeFilesRecord(loggerFiles) });
};
