import type { FileStatus, IdentifierObject } from "@voxelio/breeze";

export interface TreeNodeType {
    identifiers: IdentifierObject[];
    children: Map<string, TreeNodeType>;
    count: number;
    elementId?: string;
    isFolder?: boolean;
    icon?: string;
}

export interface FileTreeNode {
    children: Map<string, FileTreeNode>;
    count: number;
    filePath?: string;
    status?: FileStatus;
}

export function buildFileTree(diff: Map<string, FileStatus>): FileTreeNode {
    const root: FileTreeNode = { children: new Map(), count: 0 };
    for (const [path, status] of diff) {
        const parts = path.split("/");
        let current = root;

        for (let i = 0; i < parts.length - 1; i++) {
            const folder = parts[i];
            if (!current.children.has(folder)) {
                current.children.set(folder, { children: new Map(), count: 0 });
            }
            const next = current.children.get(folder);
            if (!next) {
                throw new Error(`Unexpected: folder "${folder}" not found in children`);
            }
            current = next;
        }

        const fileName = parts.at(-1);
        if (!fileName) {
            throw new Error(`Unexpected: path "${path}" has no file name`);
        }
        current.children.set(fileName, { children: new Map(), count: 1, filePath: path, status });
    }

    const calculateCount = (node: FileTreeNode): number => {
        if (node.filePath) return 1;
        let count = 0;
        for (const child of node.children.values()) {
            count += calculateCount(child);
        }
        node.count = count;
        return count;
    };

    calculateCount(root);
    return root;
}

export function matchesPath(id: IdentifierObject, folderPath: string): boolean {
    if (!folderPath) return true;
    const elementPath = `${id.namespace}/${id.resource.split("/").slice(0, -1).join("/")}`;
    return elementPath === folderPath || elementPath.startsWith(`${folderPath}/`);
}

export function hasActiveDescendant(node: TreeNodeType, activeId: string | null | undefined): boolean {
    if (!activeId) return false;
    if (node.elementId === activeId) return true;
    for (const child of node.children.values()) {
        if (hasActiveDescendant(child, activeId)) return true;
    }
    return false;
}
