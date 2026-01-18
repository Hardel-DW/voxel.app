import type { EnchantmentProps, SlotRegistryType } from "@voxelio/breeze";
import { EnchantmentAction } from "@voxelio/breeze";
import { SLOT_CONFIGS } from "@/lib/data/slots";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { SlotButton } from "./SlotButton";

export default function SlotGrid(props: { element: EnchantmentProps; elementId: string }) {
    const handleSlotToggle = (slotId: SlotRegistryType) => {
        useConfiguratorStore.getState().handleChange(EnchantmentAction.setComputedSlot("slots", slotId), props.elementId);
    };

    const isActive = (slot: (typeof SLOT_CONFIGS)[0]) => props.element.slots.some((elementSlot) => slot.slots.includes(elementSlot));

    return (
        <div className="flex flex-col gap-3">
            {/* First line : mainhand, offhand */}
            <div className="grid grid-cols-2 gap-3">
                <SlotButton slot={SLOT_CONFIGS[0]} isActive={isActive(SLOT_CONFIGS[0])} onToggle={handleSlotToggle} />
                <SlotButton slot={SLOT_CONFIGS[1]} isActive={isActive(SLOT_CONFIGS[1])} onToggle={handleSlotToggle} />
            </div>

            {/* Second line : body, saddle */}
            <div className="grid grid-cols-2 gap-3">
                <SlotButton slot={SLOT_CONFIGS[2]} isActive={isActive(SLOT_CONFIGS[2])} onToggle={handleSlotToggle} />
                <SlotButton slot={SLOT_CONFIGS[3]} isActive={isActive(SLOT_CONFIGS[3])} onToggle={handleSlotToggle} />
            </div>

            {/* Third line : armor slots */}
            <div className="grid grid-cols-4 gap-2">
                {SLOT_CONFIGS.slice(4).map((slot) => (
                    <SlotButton key={slot.id} slot={slot} isActive={isActive(slot)} onToggle={handleSlotToggle} />
                ))}
            </div>
        </div>
    );
}
