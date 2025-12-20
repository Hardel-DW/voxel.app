import { useSelectedItemStore } from "@/components/tools/elements/gui/SelectedItemStore";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDragAndDrop } from "@/lib/hook/useDragAndDrop";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import useRegistry from "@/lib/hook/useRegistry";
import { cn } from "@/lib/utils";

export default function ToolInventory({ search }: { search: string }) {
    const { data: allItems, isLoading, isError } = useRegistry<string[]>("registry", "item");
    const { handleDragStart, handleDragEnd, draggedItem } = useDragAndDrop();
    const filteredItems = allItems?.filter((item) => item !== "air" && item.toLowerCase().includes(search.toLowerCase())) ?? [];
    const { visibleItems, hasMore, ref } = useInfiniteScroll(filteredItems, 60);
    const selectedItem = useSelectedItemStore((state) => state.item);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-700 mb-4" />
                <p className="text-sm">Loading items...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <p className="text-sm">Error loading items</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-y-auto pr-1">
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: "repeat(auto-fill, 56px)",
                    gridAutoRows: "56px",
                    justifyContent: "center"
                }}>
                {visibleItems.map((item) => {
                    const isDragging = draggedItem === item;
                    return (
                        <button
                            type="button"
                            key={item}
                            className={cn(
                                "relative overflow-hidden bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors hover:bg-zinc-900/40 group",
                                isDragging && "opacity-50",
                                selectedItem === item && "bg-zinc-900/40 border-zinc-600"
                            )}
                            draggable={true}
                            onClick={() => useSelectedItemStore.setState({ item })}
                            onDragStart={(e) => {
                                const preview = e.currentTarget.querySelector(".texture-preview") as HTMLElement;
                                handleDragStart(e, item, preview);
                            }}
                            onDragEnd={handleDragEnd}>
                            <div className="texture-preview w-8 h-8 flex items-center justify-center">
                                <TextureRenderer id={item} />
                            </div>
                        </button>
                    );
                })}

                {visibleItems.length === 0 && search.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-zinc-400 p-8">
                        <p className="text-sm">Start typing to search items...</p>
                    </div>
                )}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-4 text-xs text-zinc-500">
                    Loading more items…
                </div>
            )}
        </div>
    );
}
