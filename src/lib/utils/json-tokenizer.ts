export interface Token {
    type: "string" | "number" | "boolean" | "null" | "property" | "punctuation" | "whitespace";
    value: string;
}

export function getTokenColor(type: Token["type"]): string {
    switch (type) {
        case "string":
            return "#d43dab";
        case "number":
            return "#f08d49";
        case "boolean":
            return "#4177e5";
        case "null":
            return "#4177e5";
        case "property":
            return "#d89600";
        case "punctuation":
            return "#ccc";
        default:
            return "#ccc";
    }
}

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

export function processTokensIntoLines(tokens: Token[]): Token[][] {
    let currentLine = 0;
    let currentLineTokens: Token[] = [];
    const lineTokens: Token[][] = [];

    for (const token of tokens) {
        const newlines = (token.value.match(/\n/g) || []).length;
        if (newlines === 0) {
            currentLineTokens.push(token);
        } else {
            const parts = token.value.split("\n");
            for (let i = 0; i < parts.length; i++) {
                if (i === 0) {
                    if (parts[i]) {
                        currentLineTokens.push({ ...token, value: parts[i] });
                    }
                } else {
                    lineTokens[currentLine] = currentLineTokens;
                    currentLineTokens = [];
                    currentLine++;
                    if (parts[i]) {
                        currentLineTokens.push({ ...token, value: parts[i] });
                    }
                }
            }
        }
    }
    lineTokens[currentLine] = currentLineTokens;

    return lineTokens;
}
