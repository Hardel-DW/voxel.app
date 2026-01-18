import type { DataDrivenRegistryElement, TagType } from "@voxelio/breeze";
import { Identifier, TagsProcessor } from "@voxelio/breeze";
import LoadingSlot from "@/components/tools/elements/gui/LoadingSlot";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useAnimationStore } from "@/lib/hook/useAnimationStore";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { clsx } from "@/lib/utils";

interface TagsRendererProps {
    items: string[] | string;
    intervalMs?: number;
}

export default function TagsRenderer({ items }: TagsRendererProps) {
    const tick = useAnimationStore((state) => state.tick);
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/item");
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);

    const isTag = typeof items === "string" && items.startsWith("#");
    const identifier = isTag ? Identifier.of(items, "tags/item") : null;
    const tag = isTag ? getRegistry<TagType>("tags/item") : [];
    const isCorrectTag = isTag && Boolean(data);
    const tagRegistry: DataDrivenRegistryElement<TagType>[] =
        isCorrectTag && data
            ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/item"), data: value }))
            : [];
    const processedItems =
        isCorrectTag && identifier ? new TagsProcessor([...tag, ...tagRegistry]).getRecursiveValues(identifier.get()) : [];
    const itemsArray = isTag ? processedItems : Array.isArray(items) ? items : [items];
    const currentIndex = itemsArray.length > 1 ? tick % itemsArray.length : 0;

    if (isLoading) return <LoadingSlot />;
    if (itemsArray.length === 0 || isError || !data) {
        return (
            <div className="size-10 relative shrink-0 border-2 border-red-900 rounded-md flex items-center justify-center">
                <img src="/icons/toast/error.svg" alt="No items" width={24} height={24} />
            </div>
        );
    }

    return (
        <div className={clsx(itemsArray.length > 1 && "animate-item-pulse")}>
            <TextureRenderer id={itemsArray[currentIndex]} />
        </div>
    );
}
