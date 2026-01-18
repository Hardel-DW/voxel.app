import type { FileStatus, Identifier } from "@voxelio/breeze";
import { type CONCEPT_KEY, CONCEPTS } from "@/lib/data/elements";
import { parseFilePath } from "@/lib/utils/concept";
import type { TreeNodeType } from "@/lib/utils/tree";

type ParsedFile = {
    path: string;
    identifier: Identifier;
    status: FileStatus;
};

export function buildChangesTree(diff: Map<string, FileStatus>): TreeNodeType {
    const root: TreeNodeType = { count: diff.size, children: new Map(), identifiers: [] };
    const grouped = new Map<CONCEPT_KEY, ParsedFile[]>();

    for (const concept of CONCEPTS) {
        grouped.set(concept.registry, []);
    }

    for (const [path, status] of diff) {
        const identifier = parseFilePath(path);
        if (!identifier) continue;

        const conceptKey = identifier.registry.split("/")[0] as CONCEPT_KEY;
        const group = grouped.get(conceptKey);
        if (group) {
            group.push({ path, identifier, status });
        }
    }

    for (const [registry, files] of grouped) {
        const concept = CONCEPTS.find((c) => c.registry === registry);
        const conceptIcon = concept?.image.src;

        const children = new Map<string, TreeNodeType>();
        for (const file of files) {
            children.set(file.identifier.toResourceName(), {
                count: 0,
                children: new Map(),
                identifiers: [file.identifier.get()],
                elementId: file.path,
                icon: conceptIcon
            });
        }

        root.children.set(registry, {
            count: files.length,
            children,
            identifiers: [],
            isFolder: true
        });
    }

    return root;
}

export function getConceptFolderIcons(): Record<string, string> {
    return Object.fromEntries(CONCEPTS.map((c) => [c.registry, c.image.src]));
}
