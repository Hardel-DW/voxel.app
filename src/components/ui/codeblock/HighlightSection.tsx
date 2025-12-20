import { getTokenColor, processTokensIntoLines, tokenizeJSON } from "@/lib/utils/json-tokenizer";

export default function HighlightSection(props: { children: string; language: string }) {
    if (props.language !== "json") return null;
    const lines = props.children.split("\n");
    const tokens = tokenizeJSON(props.children);
    const lineTokens = processTokensIntoLines(tokens);

    return (
        <pre className="text-gray-300 rounded-lg overflow-auto font-[Consolas] leading-normal">
            <div className="flex">
                <div className="flex-none p-4 text-right select-none border-r border-zinc-900">
                    {lines.map((_, index) => (
                        <div key={index.toString()}>{index + 1}</div>
                    ))}
                </div>
                <div className="flex-1 p-4">
                    {lineTokens.map((lineTokenList, lineIndex) => (
                        <div key={lineIndex.toString()}>
                            {lineTokenList.map((token, tokenIndex) => (
                                <span key={`${lineIndex}-${tokenIndex}-${token.type}`} style={{ color: getTokenColor(token.type) }}>
                                    {token.value}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </pre>
    );
}
