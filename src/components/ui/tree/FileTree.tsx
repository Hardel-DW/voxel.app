import { Identifier } from "@voxelio/breeze";
import { useState } from "react";
import { useTree } from "@/components/ui/tree/useTree";
import { cn } from "@/lib/utils";
import { hueToHsl, stringToColor } from "@/lib/utils/color";
import { hasActiveDescendant, type TreeNodeType } from "@/lib/utils/tree";

type TreeEntry = [string, TreeNodeType];

const sortedEntries = (children: Map<string, TreeNodeType>): TreeEntry[] =>
    [...children.entries()].toSorted(([, a], [, b]) => {
        if (!a.elementId !== !b.elementId) return a.elementId ? 1 : -1;
        return 0;
    });

export function FileTree() {
    const { tree, filterPath, currentElementId, elementIcon, folderIcons, disableAutoExpand, selectFolder, selectElement } = useTree();

    return (
        <div className="flex flex-col">
            {sortedEntries(tree.children).map(([name, node]) => (
                <TreeNode
                    key={name}
                    name={name}
                    path={name}
                    node={node}
                    depth={0}
                    filterPath={filterPath}
                    currentElementId={currentElementId}
                    elementIcon={elementIcon}
                    folderIcons={folderIcons}
                    disableAutoExpand={disableAutoExpand}
                    selectFolder={selectFolder}
                    selectElement={selectElement}
                />
            ))}
        </div>
    );
}

interface TreeNodeProps {
    name: string;
    path: string;
    node: TreeNodeType;
    depth: number;
    forceOpen?: boolean;
    filterPath: string;
    currentElementId: string | null;
    elementIcon?: string;
    folderIcons?: Record<string, string>;
    disableAutoExpand?: boolean;
    selectFolder: (path: string) => void;
    selectElement: (elementId: string) => void;
}

function TreeNode({
    name,
    path,
    node,
    depth,
    forceOpen = false,
    filterPath,
    currentElementId,
    elementIcon,
    folderIcons,
    disableAutoExpand,
    selectFolder,
    selectElement
}: TreeNodeProps) {
    const hasActiveChild = !disableAutoExpand && hasActiveDescendant(node, currentElementId);
    const [isOpen, setIsOpen] = useState(forceOpen || hasActiveChild);

    const isElement = !!node.elementId;
    const hasChildren = node.children.size > 0;
    const isHighlighted = isElement ? node.elementId === currentElementId : !currentElementId && filterPath === path;
    const isEmpty = node.count === 0 && !isElement;
    const hue = stringToColor(isElement && node.elementId ? node.elementId : path);
    const icon =
        node.icon ?? (isElement ? (elementIcon ?? "/images/features/item/bundle_open.webp") : (folderIcons?.[name] ?? "/icons/folder.svg"));
    const isDefaultFolderIcon = !isElement && !folderIcons?.[name];
    if (hasActiveChild && !isOpen) {
        setIsOpen(true);
    }

    const handleClick = () => {
        if (isElement && node.elementId) {
            selectElement(node.elementId);
            return;
        }
        setIsOpen((prev) => !prev);
        selectFolder(path);
    };

    const handleChevronClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="w-full select-none">
            <div
                className={cn(
                    "flex items-center gap-2 rounded-lg transition-colors relative group w-full",
                    isHighlighted ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                    depth > 0 && "mt-0.5",
                    isEmpty && !isHighlighted && "opacity-50"
                )}
                style={{ paddingLeft: depth * 8 + 8 }}>
                {isHighlighted && (
                    <div
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        style={{ backgroundColor: hueToHsl(hue) }}
                    />
                )}

                {!isElement && (
                    <button
                        type="button"
                        onClick={handleChevronClick}
                        className={cn("p-0.5 rounded-md transition-colors -ml-1 cursor-pointer", hasChildren && "hover:bg-zinc-700/50")}>
                        <img
                            src="/icons/chevron-down.svg"
                            className={cn("size-3 transition-transform invert", !isOpen && "-rotate-90", !hasChildren && "opacity-20")}
                            alt="Toggle folder"
                        />
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleClick}
                    className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer text-left px-3 py-2">
                    <img
                        src={icon}
                        className={cn(
                            "size-5 object-contain",
                            isDefaultFolderIcon && "opacity-60",
                            isDefaultFolderIcon && isHighlighted && "opacity-100"
                        )}
                        alt="Redirect to an element"
                    />
                    <span className="truncate text-sm font-medium">{Identifier.toDisplay(name)}</span>
                </button>

                {!isElement && (
                    <span className="text-[10px] text-zinc-600 font-mono tabular-nums bg-zinc-900/50 px-1.5 rounded-sm border border-zinc-800 group-hover:border-zinc-700">
                        {node.count}
                    </span>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className="flex flex-col border-zinc-800/50 my-1 pl-1 ml-3 border-l">
                    {sortedEntries(node.children).map(([childName, childNode]) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            path={`${path}/${childName}`}
                            node={childNode}
                            depth={depth + 1}
                            forceOpen={node.children.size === 1}
                            filterPath={filterPath}
                            currentElementId={currentElementId}
                            elementIcon={elementIcon}
                            folderIcons={folderIcons}
                            disableAutoExpand={disableAutoExpand}
                            selectFolder={selectFolder}
                            selectElement={selectElement}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
