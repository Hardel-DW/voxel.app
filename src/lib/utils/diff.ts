export type DiffLineType = "unchanged" | "added" | "removed";

export interface DiffLine {
    id: string;
    type: DiffLineType;
    content: string;
    lineNumber: number | null;
}

/**
 * Compute LCS (Longest Common Subsequence) table
 */
function computeLCSTable(original: string[], modified: string[]): number[][] {
    const m = original.length;
    const n = modified.length;
    const table: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (original[i] === modified[j]) {
                table[i][j] = 1 + table[i + 1][j + 1];
            } else {
                table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
            }
        }
    }

    return table;
}

/**
 * Compute unified diff using LCS algorithm
 */
export function computeUnifiedDiff(original: string, modified: string): DiffLine[] {
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");
    const table = computeLCSTable(originalLines, modifiedLines);
    const result: DiffLine[] = [];

    let i = 0;
    let j = 0;
    let modifiedLineNum = 1;

    while (i < originalLines.length || j < modifiedLines.length) {
        if (i >= originalLines.length) {
            result.push({ id: `a${j}`, type: "added", content: modifiedLines[j], lineNumber: modifiedLineNum++ });
            j++;
        } else if (j >= modifiedLines.length) {
            result.push({ id: `r${i}`, type: "removed", content: originalLines[i], lineNumber: null });
            i++;
        } else if (originalLines[i] === modifiedLines[j]) {
            result.push({ id: `u${i}-${j}`, type: "unchanged", content: modifiedLines[j], lineNumber: modifiedLineNum++ });
            i++;
            j++;
        } else if (table[i + 1][j] >= table[i][j + 1]) {
            result.push({ id: `r${i}`, type: "removed", content: originalLines[i], lineNumber: null });
            i++;
        } else {
            result.push({ id: `a${j}`, type: "added", content: modifiedLines[j], lineNumber: modifiedLineNum++ });
            j++;
        }
    }

    return result;
}

export function computeFullDiff(jsonString: string, type: "added" | "removed"): DiffLine[] {
    const prefix = type === "added" ? "a" : "r";
    return jsonString.split("\n").map((content, index) => ({
        id: `${prefix}${index}`,
        type,
        content,
        lineNumber: type === "added" ? index + 1 : null
    }));
}
