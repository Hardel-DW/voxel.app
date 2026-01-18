import type { SlotRegistryType } from "@voxelio/breeze";
import type { SLOT_CONFIGS } from "@/lib/data/slots";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SlotButton(props: { slot: (typeof SLOT_CONFIGS)[0]; isActive: boolean; onToggle: (slotId: SlotRegistryType) => void }) {
    const t = useTranslate();
    return (
        <button
            type="button"
            onClick={() => props.onToggle(props.slot.id as SlotRegistryType)}
            className={cn(
                "bg-black/35 border-t-2 border-l-2 border-zinc-900 ring-0 ring-zinc-900 select-none cursor-pointer relative transition-all hover:ring-1 p-3 rounded-xl min-h-20",
                props.isActive && "bg-zinc-950/25 ring-1 ring-zinc-600"
            )}>
            <div className="flex flex-col items-center justify-center h-full gap-2">
                <img src={props.slot.image} alt={props.slot.name} className="pixelated" style={{ height: "24px" }} />
                <span className="text-[10px] leading-tight text-center text-zinc-300">{t(props.slot.name)}</span>
            </div>

            <div className="absolute inset-0 -z-10 brightness-30">
                <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" loading="lazy" />
            </div>
        </button>
    );
}
