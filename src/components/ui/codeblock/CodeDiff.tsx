import { useRef } from "react";
import { cn } from "@/lib/utils";
import { computeFullDiff, computeUnifiedDiff, type DiffLine } from "@/lib/utils/diff";
import { applyJsonHighlights } from "@/lib/utils/json-tokenizer";

interface CodeDiffProps {
    original: string;
    compiled: string;
    status: "added" | "deleted" | "updated";
}

function computeDiffLines(original: string, compiled: string, status: CodeDiffProps["status"]): DiffLine[] {
    switch (status) {
        case "added":
            return computeFullDiff(compiled, "added");
        case "deleted":
            return computeFullDiff(original, "removed");
        case "updated":
            return computeUnifiedDiff(original, compiled);
    }
}

export default function CodeDiff({ original, compiled, status }: CodeDiffProps) {
    const diffLines = computeDiffLines(original, compiled, status);
    const cleanupRef = useRef<() => void>(() => {});

    const handleRef = (el: HTMLPreElement | null) => {
        if (el) {
            requestAnimationFrame(() => {
                cleanupRef.current();
                cleanupRef.current = applyJsonHighlights(el);
            });
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col">
            <div className="flex-1 flex overflow-auto">
                <div className="shrink-0 select-none text-right border-r border-zinc-800/50 font-[Consolas] text-sm leading-6">
                    {diffLines.map((line) => (
                        <div
                            key={line.id}
                            className={cn(
                                "pr-4 pl-2",
                                line.type === "added" && "text-green-500 bg-green-500/5",
                                line.type === "removed" && "text-red-500 bg-red-500/5",
                                line.type === "unchanged" && "text-zinc-600"
                            )}>
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : line.lineNumber}
                        </div>
                    ))}
                </div>
                <pre ref={handleRef} className="flex-1 font-[Consolas] text-sm leading-6 text-zinc-300 m-0 p-0">
                    {diffLines.map((line) => (
                        <div
                            key={line.id}
                            className={cn(
                                "px-4 whitespace-pre",
                                line.type === "added" && "bg-green-500/10",
                                line.type === "removed" && "bg-red-500/10"
                            )}>
                            {line.content || "\u00A0"}
                        </div>
                    ))}
                </pre>
            </div>
        </div>
    );
}
