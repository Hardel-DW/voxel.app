import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { useDynamicIsland } from "@/components/tools/floatingbar/FloatingBarContext";
import ItemSelector from "./ItemSelector";

interface MinecraftSlotProps {
    id: string;
    count: number;
    onItemChange: (itemId: string) => void;
    items: () => string[];
}

export default function MinecraftSlot({ id, count, onItemChange, items }: MinecraftSlotProps) {
    const { expand } = useDynamicIsland();
    const handleSlotClick = () => expand(<ItemSelector currentItem={id} onItemSelect={onItemChange} items={items()} />);

    return (
        <button
            type="button"
            className="cursor-pointer size-16 relative border-2 border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
            onClick={handleSlotClick}>
            {id && <TextureRenderer id={id} />}
            {count > 1 && <span className="absolute bottom-0 right-0 text-xl text-white font-seven">{count}</span>}
        </button>
    );
}
