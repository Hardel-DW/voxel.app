export interface Token {
    type: "string" | "number" | "boolean" | "null" | "property" | "punctuation" | "whitespace";
    value: string;
}

const TOKEN_HIGHLIGHT_NAMES = {
    string: "json-string",
    number: "json-number",
    boolean: "json-boolean",
    null: "json-null",
    property: "json-property",
    punctuation: "json-punctuation"
} as const;

export function tokenizeJSON(json: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < json.length) {
        const char = json[i];

        if (/\s/.test(char)) {
            let whitespace = "";
            while (i < json.length && /\s/.test(json[i])) {
                whitespace += json[i];
                i++;
            }
            tokens.push({ type: "whitespace", value: whitespace });
            continue;
        }

        if (char === '"') {
            let str = '"';
            i++;
            let isProperty = false;
            while (i < json.length && json[i] !== '"') {
                if (json[i] === "\\") {
                    str += json[i];
                    i++;
                    if (i < json.length) {
                        str += json[i];
                        i++;
                    }
                } else {
                    str += json[i];
                    i++;
                }
            }
            if (i < json.length) {
                str += '"';
                i++;
            }

            let j = i;
            while (j < json.length && /\s/.test(json[j])) j++;
            if (j < json.length && json[j] === ":") {
                isProperty = true;
            }

            tokens.push({ type: isProperty ? "property" : "string", value: str });
            continue;
        }

        if (/[{}[\]:,]/.test(char)) {
            tokens.push({ type: "punctuation", value: char });
            i++;
            continue;
        }

        if (/[0-9-]/.test(char)) {
            let num = "";
            while (i < json.length && /[0-9.eE+-]/.test(json[i])) {
                num += json[i];
                i++;
            }
            tokens.push({ type: "number", value: num });
            continue;
        }

        if (char === "t" && json.slice(i, i + 4) === "true") {
            tokens.push({ type: "boolean", value: "true" });
            i += 4;
            continue;
        }

        if (char === "f" && json.slice(i, i + 5) === "false") {
            tokens.push({ type: "boolean", value: "false" });
            i += 5;
            continue;
        }

        if (char === "n" && json.slice(i, i + 4) === "null") {
            tokens.push({ type: "null", value: "null" });
            i += 4;
            continue;
        }

        tokens.push({ type: "punctuation", value: char });
        i++;
    }

    return tokens;
}

export function applyJsonHighlights(element: HTMLElement): () => void {
    if (!CSS.highlights) {
        console.warn("CSS Custom Highlight API not supported");
        return () => {};
    }

    const text = element.textContent ?? "";
    const tokens = tokenizeJSON(text);
    const tokensByType = Map.groupBy(
        tokens.filter((t) => t.type !== "whitespace"),
        (t) => t.type
    );
    const createdHighlights: string[] = [];

    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        textNodes.push(node as Text);
        node = walker.nextNode();
    }

    if (textNodes.length === 0) return () => {};

    const positionMap: Array<{ node: Text; localOffset: number }> = [];
    let globalOffset = 0;
    for (const textNode of textNodes) {
        const length = textNode.textContent?.length ?? 0;
        for (let i = 0; i < length; i++) {
            positionMap[globalOffset + i] = { node: textNode, localOffset: i };
        }
        globalOffset += length;
    }

    for (const [type, typeTokens] of tokensByType) {
        if (!typeTokens) continue;
        const highlightName = TOKEN_HIGHLIGHT_NAMES[type as keyof typeof TOKEN_HIGHLIGHT_NAMES];
        if (!highlightName) continue;

        const ranges: Range[] = [];
        let currentPos = 0;

        for (const token of tokens) {
            if (token.type === type) {
                const start = positionMap[currentPos];
                const end = positionMap[currentPos + token.value.length - 1];

                if (start && end) {
                    const range = new Range();
                    range.setStart(start.node, start.localOffset);
                    range.setEnd(end.node, end.localOffset + 1);
                    ranges.push(range);
                }
            }
            currentPos += token.value.length;
        }

        if (ranges.length > 0) {
            const highlight = new Highlight(...ranges);
            CSS.highlights.set(highlightName, highlight);
            createdHighlights.push(highlightName);
        }
    }

    return () => {
        for (const name of createdHighlights) {
            CSS.highlights.delete(name);
        }
    };
}
