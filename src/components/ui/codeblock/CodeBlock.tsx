import ButtonCopy from "@/components/ui/codeblock/ButtonCopy";
import ButtonDownload from "@/components/ui/codeblock/ButtonDownload";
import HighlightSection from "@/components/ui/codeblock/HighlightSection";
import { cn } from "@/lib/utils";

export default function CodeBlock(props: { children: string; className?: string; language: string }) {
    return (
        <div className={cn("relative w-full h-full flex flex-col overflow-hidden", props.className)}>
            <div className="absolute z-10 top-0 right-0 m-4">
                <div className="flex flex-col gap-y-4">
                    <ButtonCopy snippet={props.children} />
                    <ButtonDownload snippet={props.children} />
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <HighlightSection language={props.language}>{props.children}</HighlightSection>
            </div>
        </div>
    );
}
