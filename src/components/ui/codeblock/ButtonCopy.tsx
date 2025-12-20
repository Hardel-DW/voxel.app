import { useEffect, useState } from "react";

export default function ButtonCopy(props: { snippet: string }) {
    const [pending, setPending] = useState<boolean>(false);

    const copy = async () => {
        setPending(true);
        await navigator.clipboard.writeText(props.snippet);
    };

    useEffect(() => {
        if (pending) {
            setTimeout(() => setPending(false), 3000);
        }
    }, [pending]);

    return (
        <div
            className={
                "w-12 h-12 p-2 hover:bg-zinc-800/50 cursor-pointer transition bg-black/10 border border-white/10 rounded-md flex justify-center items-center"
            }>
            {pending ? (
                <img alt="checked" src="/icons/check.svg" className="invert" width={24} height={24} />
            ) : (
                <img onKeyDown={copy} onClick={copy} alt="copy" src="/icons/copy.svg" className="invert" width={24} height={24} />
            )}
        </div>
    );
}
