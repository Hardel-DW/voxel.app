import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { cn } from "@/lib/utils";

export default function MinecraftItem(props: { item: string; className?: string }) {
    return (
        <span className={cn("p-1.5 relative opacity-60 hover:opacity-100 transition ease-in-out cursor-pointer", props.className)}>
            <TextureRenderer id={props.item} />
        </span>
    );
}
