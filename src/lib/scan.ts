export default function reactScan() {
    return {
        name: "react-scan",
        transformIndexHtml() {
            if (process.env.NODE_ENV === "production") return [];
            return [
                {
                    tag: "script",
                    attrs: {
                        src: "https://unpkg.com/react-scan/dist/auto.global.js",
                        crossorigin: "anonymous"
                    },
                    injectTo: "head"
                }
            ];
        }
    };
}
