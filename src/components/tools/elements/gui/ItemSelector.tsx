import { useState } from "react";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useClickOutside } from "@/lib/hook/useClickOutside";
import { useInfiniteScroll } from "@/lib/hook/useInfiniteScroll";
import { useTranslate } from "@/lib/i18n";
import { clsx } from "@/lib/utils";

interface ItemSelectorProps {
    currentItem: string;
    onItemSelect?: (itemId: string) => void;
    items?: string[];
}

export default function ItemSelector({ currentItem, onItemSelect, items }: ItemSelectorProps) {
    const t = useTranslate();
    const [searchTerm, setSearchTerm] = useState("");
    const { collapse } = useDynamicIsland();
    const containerRef = useClickOutside(collapse);
    const filteredItems = items?.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];
    const { visibleItems, hasMore, ref: loadMoreRef } = useInfiniteScroll(filteredItems, 150, [searchTerm]);
    const handleValidate = (itemId: string) => {
        onItemSelect?.(itemId);
        collapse();
    };

    return (
        <div ref={containerRef} className="grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
            {/* Header */}
            <div className="pb-4 border-b border-zinc-800/50">
                <TextInput placeholder={t("item_selector.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Body - scrollable */}
            <div className="overflow-y-auto py-4 -mx-1 px-1 min-h-0">
                <div className="grid grid-cols-items gap-2 content-start">
                    {visibleItems.map((itemId) => (
                        <button
                            key={itemId}
                            type="button"
                            onClick={() => handleValidate(itemId)}
                            className={clsx(
                                "size-14 relative flex items-center justify-center cursor-pointer border-2 rounded transition-colors",
                                currentItem === itemId ? "border-zinc-600 bg-white/5" : "border-zinc-800 hover:border-zinc-600"
                            )}>
                            <TextureRenderer id={itemId} />
                        </button>
                    ))}
                </div>

                {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center items-center py-4">
                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="size-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-400">{t("item_selector.select")}</span>
                <Button onClick={collapse} variant="ghost_border" size="sm">
                    {t("item_selector.cancel")}
                </Button>
            </div>
        </div>
    );
}
