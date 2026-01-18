import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { applyJsonHighlights } from "@/lib/utils/json-tokenizer";

interface JsonError {
    message: string;
    line: number;
}

interface JsonEditorProps {
    initialValue: string;
    className?: string;
}

function parseJsonError(error: SyntaxError, content: string): JsonError {
    const match = error.message.match(/position (\d+)/i);
    if (match) {
        const position = Number.parseInt(match[1], 10);
        const line = content.slice(0, position).split("\n").length;
        return { message: error.message, line };
    }
    return { message: error.message, line: 1 };
}

function validateJson(content: string): JsonError | null {
    if (!content.trim()) return null;
    try {
        JSON.parse(content);
        return null;
    } catch (e) {
        if (e instanceof SyntaxError) {
            return parseJsonError(e, content);
        }
        return { message: "Invalid JSON", line: 1 };
    }
}

function getAbsoluteOffset(container: HTMLElement, node: Node, offset: number): number {
    let absoluteOffset = 0;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
        if (current === node) {
            return absoluteOffset + offset;
        }
        absoluteOffset += current.textContent?.length ?? 0;
        current = walker.nextNode();
    }
    return absoluteOffset;
}

function findNodeAtOffset(container: HTMLElement, targetOffset: number): { node: Node; offset: number } | null {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let node = walker.nextNode();

    while (node) {
        const length = node.textContent?.length ?? 0;
        if (currentOffset + length >= targetOffset) {
            return { node, offset: targetOffset - currentOffset };
        }
        currentOffset += length;
        node = walker.nextNode();
    }
    return null;
}

function restoreSelection(container: HTMLElement, startOffset: number, endOffset: number): void {
    const start = findNodeAtOffset(container, startOffset);
    const end = findNodeAtOffset(container, endOffset);
    if (!start || !end) return;

    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
}

function LineNumbers({ count, errorLine }: { count: number; errorLine: number | null }) {
    return (
        <div className="shrink-0 select-none text-right px-4 border-r border-zinc-800/50 text-zinc-600 font-[Consolas] text-sm leading-6">
            {Array.from({ length: count }, (_, i) => {
                const lineNum = i + 1;
                return (
                    <div key={`line-${lineNum}`} className={cn(errorLine === lineNum && "text-red-400 bg-red-500/10")}>
                        {lineNum}
                    </div>
                );
            })}
        </div>
    );
}

export default function JsonEditor({ initialValue, className }: JsonEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const cleanupRef = useRef<() => void>(() => {});
    const [error, setError] = useState<JsonError | null>(() => validateJson(initialValue));
    const [lineCount, setLineCount] = useState(() => initialValue.split("\n").length);

    const updateHighlights = () => {
        if (!editorRef.current) return;
        cleanupRef.current();
        editorRef.current.normalize();
        cleanupRef.current = applyJsonHighlights(editorRef.current);
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        const content = editorRef.current.textContent ?? "";
        setError(validateJson(content));
        setLineCount(content.split("\n").length || 1);
        updateHighlights();
    };

    const insertText = (text: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const moveLines = (direction: "up" | "down") => {
        if (!editorRef.current) return;
        const content = editorRef.current.textContent ?? "";
        const lines = content.split("\n");
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const startOffset = getAbsoluteOffset(editorRef.current, range.startContainer, range.startOffset);
        const endOffset = getAbsoluteOffset(editorRef.current, range.endContainer, range.endOffset);
        const textBeforeStart = content.slice(0, startOffset);
        const textBeforeEnd = content.slice(0, endOffset);
        const startLineIndex = textBeforeStart.split("\n").length - 1;
        const endLineIndex = textBeforeEnd.split("\n").length - 1;
        const targetIndex = direction === "up" ? startLineIndex - 1 : endLineIndex + 1;
        if (targetIndex < 0 || targetIndex >= lines.length) return;

        const blockStart = Math.min(startLineIndex, endLineIndex);
        const blockEnd = Math.max(startLineIndex, endLineIndex);
        const movedLineLength = direction === "up" ? lines[blockStart - 1].length : lines[blockEnd + 1].length;

        if (direction === "up") {
            const lineToMove = lines.splice(blockStart - 1, 1)[0];
            lines.splice(blockEnd, 0, lineToMove);
        } else {
            const lineToMove = lines.splice(blockEnd + 1, 1)[0];
            lines.splice(blockStart, 0, lineToMove);
        }

        editorRef.current.textContent = lines.join("\n");
        const lineDelta = direction === "up" ? -(movedLineLength + 1) : movedLineLength + 1;
        const newStartOffset = startOffset + lineDelta;
        const newEndOffset = endOffset + lineDelta;

        restoreSelection(editorRef.current, newStartOffset, newEndOffset);
        handleInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
        }

        if (e.key === "Tab") {
            e.preventDefault();
            insertText("    ");
            handleInput();
        }

        if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
            e.preventDefault();
            moveLines(e.key === "ArrowUp" ? "up" : "down");
        }
    };

    const handleRef = (el: HTMLDivElement | null) => {
        editorRef.current = el;
        if (el) {
            requestAnimationFrame(() => {
                el.normalize();
                cleanupRef.current = applyJsonHighlights(el);
            });
        }
    };

    return (
        <div className={cn("relative flex flex-col h-full overflow-hidden", className)}>
            {error && (
                <div className="absolute top-2 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 text-sm rounded-lg">
                    <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <span>
                        Line {error.line}: {error.message}
                    </span>
                </div>
            )}

            <div className="flex-1 flex overflow-auto cursor-text">
                <LineNumbers count={lineCount} errorLine={error?.line ?? null} />

                {/* biome-ignore lint/a11y/noStaticElementInteractions: contentEditable div acts as text editor */}
                <div
                    ref={handleRef}
                    contentEditable="plaintext-only"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className={cn(
                        "flex-1 px-4 outline-none",
                        "font-[Consolas] text-sm leading-6",
                        "whitespace-pre text-zinc-300",
                        "caret-zinc-100 selection:bg-blue-500/30"
                    )}
                    suppressContentEditableWarning>
                    {initialValue}
                </div>
            </div>
        </div>
    );
}
