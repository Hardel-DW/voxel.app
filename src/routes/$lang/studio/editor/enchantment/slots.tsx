import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps, SlotRegistryType } from "@voxelio/breeze";
import { EnchantmentAction } from "@voxelio/breeze";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { SLOT_CONFIGS } from "@/lib/data/slots";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/slots")({
    component: EnchantmentSlotsPage
});

function EnchantmentSlotsPage() {
    const t = useTranslate();
    const groupedSlots = [
        SLOT_CONFIGS.filter((config) => ["mainhand", "offhand"].includes(config.id)),
        SLOT_CONFIGS.filter((config) => ["body", "saddle"].includes(config.id)),
        SLOT_CONFIGS.filter((config) => ["head", "chest", "legs", "feet"].includes(config.id))
    ];

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolSection id="slots" title={t("enchantment:section.slots.description")}>
                {groupedSlots.map((group) => (
                    <div key={group.map((config) => config.id).join(",")} className="grid max-xl:grid-cols-1 gap-4 grid-auto-64">
                        {group.map((config) => (
                            <ToolSlot
                                key={config.id}
                                title={t(config.name)}
                                image={config.image}
                                action={EnchantmentAction.setComputedSlot("slots", config.id as SlotRegistryType)}
                                renderer={(el: EnchantmentProps) => el.slots.some((slot) => config.slots.includes(slot))}
                            />
                        ))}
                    </div>
                ))}

                <div className="flex flex-col gap-4 p-4">
                    <p className="text-zinc-300">{t("enchantment:slots.explanation.title")}</p>
                    <div>
                        <ul className="list-disc list-inside space-y-2">
                            <li className="text-zinc-400">{t("enchantment:slots.explanation.list.1")}</li>
                            <li className="text-zinc-400">{t("enchantment:slots.explanation.list.2")}</li>
                        </ul>
                    </div>
                </div>
            </ToolSection>
        </div>
    );
}
