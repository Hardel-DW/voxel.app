import { Identifier, type IdentifierObject } from "@voxelio/breeze";

export interface TreeNodeType {
    identifiers: IdentifierObject[];
    children: Map<string, TreeNodeType>;
    count: number;
    elementId?: string;
    isFolder?: boolean;
}

export function buildTree(identifiers: IdentifierObject[], includeElements = false): TreeNodeType {
    const root: TreeNodeType = { identifiers: [], children: new Map(), count: 0 };
    for (const id of identifiers) {
        const parts = id.resource.split("/");
        const folders = [id.namespace, ...parts.slice(0, -1)];

        let current = root;
        for (const folder of folders) {
            if (!current.children.has(folder)) {
                current.children.set(folder, { identifiers: [], children: new Map(), count: 0, isFolder: true });
            }

            const next = current.children.get(folder);
            if (!next) {
                throw new Error(`Unexpected: folder "${folder}" not found in children`);
            }

            current = next;
        }

        current.identifiers.push(id);

        if (includeElements) {
            const elementName = parts[parts.length - 1];
            const elementId = new Identifier(id).toUniqueKey();
            const existing = current.children.get(elementName);
            if (!existing || !existing.isFolder) {
                current.children.set(elementName, { identifiers: [id], children: new Map(), count: 1, elementId });
            }
        }
    }

    const calculateCount = (node: TreeNodeType): number => {
        if (node.elementId) return 1;
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
