import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type DebugLog, type LogLevel, useDebugStore } from "@/lib/store/DebugStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/debug")({
    component: DebugPage
});

const levelStyles: Record<LogLevel, string> = {
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
};

function LogRow({ log }: { log: DebugLog }) {
    const [expanded, setExpanded] = useState(false);
    const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3
    });

    const hasData = log.data && Object.keys(log.data).length > 0;

    return (
        <>
            <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                <td className="px-4 py-2 text-xs text-zinc-500 font-mono whitespace-nowrap">{time}</td>
                <td className="px-4 py-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded border font-medium", levelStyles[log.level])}>
                        {log.level.toUpperCase()}
                    </span>
                </td>
                <td className="px-4 py-2 text-xs text-zinc-400 font-medium">{log.category}</td>
                <td className="px-4 py-2 text-sm text-zinc-300">{log.message}</td>
                <td className="px-4 py-2">
                    {hasData && (
                        <button
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                            <img
                                src="/icons/chevron-right.svg"
                                alt="Expand"
                                className={cn("size-3 invert opacity-50 transition-transform", expanded && "rotate-90")}
                            />
                            {expanded ? "Hide" : "Show"} data
                        </button>
                    )}
                </td>
            </tr>
            {expanded && hasData && (
                <tr className="bg-zinc-900/30">
                    <td colSpan={5} className="px-4 py-3">
                        <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                        </pre>
                    </td>
                </tr>
            )}
        </>
    );
}

function DebugPage() {
    const logs = useDebugStore((s) => s.logs);
    const clearLogs = useDebugStore((s) => s.clearLogs);

    return (
        <div className="flex flex-col size-full bg-neutral-950">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <div>
                    <h1 className="text-lg font-semibold text-zinc-100">Debug Logs</h1>
                    <p className="text-xs text-zinc-500">{logs.length} entries</p>
                </div>
                <Button variant="ghost_border" size="sm" onClick={clearLogs}>
                    Clear
                </Button>
            </div>

            <div className="flex-1 overflow-auto">
                {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-zinc-500">No logs yet</div>
                ) : (
                    <table className="w-full">
                        <thead className="sticky top-0 bg-zinc-950 border-b border-zinc-800">
                            <tr className="text-left text-xs text-zinc-500 uppercase">
                                <th className="px-4 py-3 font-medium">Time</th>
                                <th className="px-4 py-3 font-medium">Level</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Message</th>
                                <th className="px-4 py-3 font-medium">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <LogRow key={log.id} log={log} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
