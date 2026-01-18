import { Link } from "@tanstack/react-router";
import type { FileStatus } from "@voxelio/breeze";
import { useState } from "react";
import { t } from "@/lib/i18n";
import { useChangesTreeStore, useIsSelected } from "@/lib/store/ChangesTreeStore";
import { cn } from "@/lib/utils";
import { buildFileTree, type FileTreeNode } from "@/lib/utils/tree";

interface ChangesFileTreeProps {
    diff: Map<string, FileStatus>;
    allFiles?: Record<string, Uint8Array>;
    selectedFile?: string;
}

export function ChangesFileTree({ diff, allFiles, selectedFile }: ChangesFileTreeProps) {
    const [showAll, setShowAll] = useState(false);
    const setSelectedFile = useChangesTreeStore((s) => s.setSelectedFile);
    const storeSelectedFile = useChangesTreeStore((s) => s.selectedFile);
    if (selectedFile !== storeSelectedFile) {
        setSelectedFile(selectedFile);
    }

    const displayFiles =
        showAll && allFiles ? new Map(Object.keys(allFiles).map((path) => [path, diff.get(path) ?? ("unchanged" as FileStatus)])) : diff;
    const tree = buildFileTree(displayFiles);
    const isEmpty = diff.size === 0 && !showAll;

    return (
        <div className="flex flex-col select-none">
            {allFiles && (
                <button
                    type="button"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 mb-2 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
                    <span className={showAll ? "text-orange-400" : ""}>{showAll ? "Hide" : "Show"} unedited files</span>
                </button>
            )}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
                    <img src="/icons/check.svg" className="size-6 opacity-20 invert" alt="No changes detected" />
                    <span className="text-xs">{t("git.no_changes")}</span>
                </div>
            ) : (
                sortedEntries(tree.children).map(([name, node]) => <TreeNode key={name} name={name} node={node} depth={0} />)
            )}
        </div>
    );
}

const sortedEntries = (children: Map<string, FileTreeNode>): [string, FileTreeNode][] =>
    [...children.entries()].toSorted(([, a], [, b]) => {
        if (!a.filePath !== !b.filePath) return a.filePath ? 1 : -1;
        return 0;
    });

interface TreeNodeProps {
    name: string;
    node: FileTreeNode;
    depth: number;
    forceOpen?: boolean;
}

function hasSingleFolderChild(node: FileTreeNode): boolean {
    if (node.children.size !== 1) return false;
    const child = node.children.values().next().value;
    return child !== undefined && !child.filePath;
}

function TreeNode({ name, node, depth, forceOpen = false }: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(forceOpen);
    const isSelected = useIsSelected(node.filePath);
    const isFile = !!node.filePath;
    const hasChildren = node.children.size > 0;

    const onChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const rowContent = (
        <div
            className={cn(
                "flex items-center gap-1.5 rounded-lg transition-colors relative group w-full select-none",
                isSelected ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                depth > 0 && "mt-0.5"
            )}
            style={{ paddingLeft: depth * 12 + 8 }}>
            {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            )}

            {!isFile && (
                <button
                    type="button"
                    onClick={onChevronClick}
                    className={cn("p-0.5 rounded-md transition-colors cursor-pointer", hasChildren && "hover:bg-zinc-700/50")}>
                    <img
                        src="/icons/chevron-down.svg"
                        className={cn("size-3 transition-transform invert", !isOpen && "-rotate-90", !hasChildren && "opacity-20")}
                        alt="Toggle"
                    />
                </button>
            )}

            <div className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5">
                {isFile ? (
                    <span
                        className={cn(
                            "text-[10px] font-bold w-3 text-center shrink-0",
                            node.status === "added" && "text-green-500",
                            node.status === "updated" && "text-yellow-500",
                            node.status === "deleted" && "text-red-500",
                            !node.status && "text-zinc-600"
                        )}>
                        {node.status === "added" ? "A" : node.status === "updated" ? "M" : node.status === "deleted" ? "D" : "·"}
                    </span>
                ) : (
                    <img src="/icons/folder.svg" className="size-4 opacity-60 shrink-0" alt="Folder" />
                )}
                <span className="truncate text-xs font-mono">{name}</span>
            </div>

            {!isFile && (
                <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 mr-2">
                    {node.count}
                </span>
            )}
        </div>
    );

    return (
        <div className="w-full select-none">
            {node.filePath ? (
                <Link to="/editor/changes/diff" search={{ file: node.filePath }}>
                    {rowContent}
                </Link>
            ) : (
                <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="w-full text-left">
                    {rowContent}
                </button>
            )}

            {hasChildren && isOpen && (
                <div className="flex flex-col border-zinc-800/50 my-0.5 pl-1 ml-3 border-l">
                    {sortedEntries(node.children).map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            node={childNode}
                            depth={depth + 1}
                            forceOpen={hasSingleFolderChild(node)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
