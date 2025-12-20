import { useRef } from "react";
import { useTooltipStore } from "@/lib/hook/useTooltip";
import { useTooltipPosition } from "@/lib/hook/useTooltipPosition";

export default function ItemTooltip({ categories }: { categories?: string[] }) {
    const hoveredItem = useTooltipStore((state) => state.hoveredItem);
    const ref = useRef<HTMLDivElement>(null);
    const position = useTooltipPosition(ref);

    if (!hoveredItem) return null;

    const itemName = hoveredItem
        .replace(/^[^:]+:/, "")
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <div
            ref={ref}
            className="fixed left-0 top-0 mx-1 my-[0.1rem] p-1.5 pointer-events-none z-10 bg-[#100010f0] after:absolute after:top-[0.1rem] after:-right-[0.1rem] after:bottom-[0.1rem] after:-left-[0.1rem] after:border-[0.1rem] after:border-[#100010f0] border-none-solid before:right-0 before:left-0 before:top-[0.1rem] before:bottom-[0.1rem] tooltip-border"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
            <div className="font-seven text-base text-white whitespace-nowrap text-left word-spacing">
                <div className="text-name text-shadow-tooltip text-shadow-[#3e3e3e] ">{itemName}</div>
                <div className="text-base mt-[0.2em] text-lore text-shadow-tooltip text-shadow-[#151415]">{hoveredItem}</div>
                {categories && categories.length > 0 && (
                    <div className="mt-2">
                        {categories.map((category) => (
                            <div key={category} className="text-attribute text-shadow-tooltip text-shadow-[#15153e]">
                                {category}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
