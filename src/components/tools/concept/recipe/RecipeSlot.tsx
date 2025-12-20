import { RecipeAction } from "@voxelio/breeze";
import { useSelectedItemStore } from "@/components/tools/elements/gui/SelectedItemStore";
import TagsRenderer from "@/components/tools/elements/texture/TagsRenderer";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useDragAndDrop } from "@/lib/hook/useDragAndDrop";
import { useTooltipStore } from "@/lib/hook/useTooltip";

interface RecipeSlotProps {
    slotIndex?: string;
    item?: string[] | string;
    count?: number;
    isEmpty?: boolean;
    isResult?: boolean;
    interactive?: boolean;
}

export default function RecipeSlot({ slotIndex, item, count, isEmpty = false, isResult = false, interactive = false }: RecipeSlotProps) {
    const setHoveredItem = useTooltipStore((state) => state.setHoveredItem);
    const handleChange = useConfiguratorStore((state) => state.handleChange);

    const { handleDragOver, handleDrop } = useDragAndDrop({
        onDrop: (droppedItem, slot) => {
            if (!interactive || !slot) return;
            handleChange(RecipeAction.addIngredient(slot, [droppedItem], true));
        },
        onSlotClear: (slot) => {
            if (!interactive || !slot) return;
            handleChange(RecipeAction.clearSlot(slot));
        }
    });

    const applySelectedItem = () => {
        if (!interactive || !slotIndex) return;
        const selectedItem = useSelectedItemStore.getState().item;
        if (!selectedItem) return;
        handleChange(RecipeAction.addIngredient(slotIndex, [selectedItem], false));
    };

    const clearCurrentSlot = () => {
        if (!interactive || !slotIndex) return;
        handleChange(RecipeAction.clearSlot(slotIndex));
    };

    const startPaintMode = (mode: "painting" | "erasing") => {
        useSelectedItemStore.setState({ paintMode: mode });
        const stopPaintMode = () => {
            useSelectedItemStore.setState({ paintMode: "none" });
            document.removeEventListener("mouseup", stopPaintMode);
        };
        document.addEventListener("mouseup", stopPaintMode);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!interactive) return;

        if (e.button === 0) {
            const selectedItem = useSelectedItemStore.getState().item;
            if (!selectedItem) return;
            applySelectedItem();
            startPaintMode("painting");
        } else if (e.button === 2) {
            e.preventDefault();
            clearCurrentSlot();
            startPaintMode("erasing");
        }
    };

    const handleMouseEnter = () => {
        if (!interactive) return;
        const paintMode = useSelectedItemStore.getState().paintMode;
        if (paintMode === "painting") applySelectedItem();
        if (paintMode === "erasing") clearCurrentSlot();

        const displayItem = Array.isArray(item) ? item[0] : item;
        if (displayItem) setHoveredItem(displayItem);
    };

    const displayItem = Array.isArray(item) ? item[0] : item;

    return (
        <div className="relative">
            <button
                type="button"
                className="shrink-0 outline outline-zinc-600 rounded bg-zinc-800/50 size-12 flex items-center justify-center hover:outline-zinc-500 transition-colors"
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setHoveredItem(undefined)}
                onDragOver={interactive ? handleDragOver : undefined}
                onDrop={interactive && slotIndex ? (e) => handleDrop(e, slotIndex) : undefined}
                onContextMenu={(e) => e.preventDefault()}>
                {!isEmpty && item && displayItem && (isResult ? <TextureRenderer id={displayItem} /> : <TagsRenderer items={item} />)}
            </button>
            {count && count > 1 && (
                <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                    {count}
                </span>
            )}
        </div>
    );
}
