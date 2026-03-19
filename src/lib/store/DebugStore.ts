import { create } from "zustand";

export type LogLevel = "info" | "warn" | "error" | "success";

export interface DebugLog {
    id: string;
    timestamp: number;
    level: LogLevel;
    category: string;
    message: string;
    data?: Record<string, unknown>;
}

interface DebugState {
    logs: DebugLog[];
    maxLogs: number;
    addLog: (log: Omit<DebugLog, "id" | "timestamp">) => void;
    clearLogs: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
    logs: [],
    maxLogs: 500,
    addLog: (log) =>
        set((state) => ({
            logs: [
                { ...log, id: crypto.randomUUID(), timestamp: Date.now() },
                ...state.logs
            ].slice(0, state.maxLogs)
        })),
    clearLogs: () => set({ logs: [] })
}));

class LogBuilder {
    private level: LogLevel = "info";
    private category = "General";
    private message = "";
    private data?: Record<string, unknown>;

    info(): this {
        this.level = "info";
        return this;
    }

    warn(): this {
        this.level = "warn";
        return this;
    }

    error(): this {
        this.level = "error";
        return this;
    }

    success(): this {
        this.level = "success";
        return this;
    }

    cat(category: string): this {
        this.category = category;
        return this;
    }

    msg(message: string): this {
        this.message = message;
        return this;
    }

    with(data: Record<string, unknown>): this {
        this.data = data;
        return this;
    }

    send(): void {
        useDebugStore.getState().addLog({
            level: this.level,
            category: this.category,
            message: this.message,
            data: this.data
        });
    }
}

export const logger = {
    info: () => new LogBuilder().info(),
    warn: () => new LogBuilder().warn(),
    error: () => new LogBuilder().error(),
    success: () => new LogBuilder().success()
};
