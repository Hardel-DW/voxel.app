import { useEffect, useState } from "react";

export default function ButtonCopy(props: { snippet: string }) {
    const [pending, setPending] = useState<boolean>(false);

    const copy = async () => {
        setPending(true);
        await navigator.clipboard.writeText(props.snippet);
    };

    useEffect(() => {
        if (!pending) return;
        const timeout = setTimeout(() => setPending(false), 3000);
        return () => clearTimeout(timeout);
    }, [pending]);

    return (
        <div className="w-10 h-10 p-2 hover:bg-zinc-800/50 cursor-pointer transition bg-black/10 border border-white/10 rounded-md flex justify-center items-center">
            {pending ? (
                <img alt="checked" src="/icons/check.svg" className="invert" />
            ) : (
                <img onKeyDown={copy} onClick={copy} alt="copy" src="/icons/copy.svg" className="invert" />
            )}
        </div>
    );
}
