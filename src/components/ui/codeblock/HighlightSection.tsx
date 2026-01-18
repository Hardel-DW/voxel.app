import { useRef } from "react";
import { applyJsonHighlights } from "@/lib/utils/json-tokenizer";

interface HighlightSectionProps {
    children: string;
    language: string;
}

export default function HighlightSection({ children, language }: HighlightSectionProps) {
    const cleanupRef = useRef<() => void>(() => {});
    const lineCount = children.split("\n").length;
    if (language !== "json") return null;

    const handleRef = (el: HTMLPreElement | null) => {
        if (el) {
            requestAnimationFrame(() => {
                cleanupRef.current();
                cleanupRef.current = applyJsonHighlights(el);
            });
        }
    };

    return (
        <div className="flex font-[Consolas] text-sm leading-6">
            <div className="shrink-0 select-none text-right px-4 border-r border-zinc-800/50 text-zinc-600">
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={`line-${i + 1}`}>{i + 1}</div>
                ))}
            </div>
            <pre ref={handleRef} className="flex-1 px-4 whitespace-pre text-zinc-300 m-0">
                {children}
            </pre>
        </div>
    );
}
