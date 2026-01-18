import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction, Identifier } from "@voxelio/breeze";
import ToolRange from "@/components/tools/elements/ToolRange";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSwitch from "@/components/tools/elements/ToolSwitch";
import { useElementProperty } from "@/lib/hook/useBreezeElement";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { isMinecraft } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/technical")({
    component: EnchantmentTechnicalPage
});

const FIELDS = [
    "smelts_loot",
    "prevent_ice_melting",
    "prevent_infested_block_spawning",
    "prevent_bee_spawning",
    "prevent_pot_shattering",
    "price_doubled"
];

function EnchantmentTechnicalPage() {
    const t = useTranslate();
    const currentElementId = useNavigationStore((state) => state.currentElementId);
    const effectKeys = useElementProperty((el) => (el?.effects ? Object.keys(el.effects) : []), currentElementId, !!currentElementId);
    if (!currentElementId) return null;

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolSection id="technical_behaviour" title={t("enchantment:section.technical.description")}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {FIELDS.map((field) => (
                        <ToolSwitch
                            key={field}
                            title={t(`enchantment:technical.${field}.title`)}
                            description={t(`enchantment:technical.${field}.description`)}
                            action={CoreAction.toggleValueInList("tags", `#minecraft:${field}`)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(`#minecraft:${field}`)}
                            lock={[isMinecraft]}
                        />
                    ))}
                </div>
            </ToolSection>

            <ToolSection
                id="costs"
                title={t("enchantment:section.costs")}
                button={{ text: "documentation", url: "https://minecraft.wiki/w/Enchanting_mechanics" }}>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    {["minCostBase", "minCostPerLevelAboveFirst", "maxCostBase", "maxCostPerLevelAboveFirst"].map((field) => (
                        <div key={field}>
                            <ToolRange
                                key={field}
                                label={t(`enchantment:global.${field}.title`)}
                                min={0}
                                max={100}
                                step={1}
                                action={(value: number) => CoreAction.setValue(field, value)}
                                renderer={(el: EnchantmentProps) => el[field]}
                            />
                        </div>
                    ))}
                </div>
            </ToolSection>

            <ToolSection id="effects" title={t("enchantment:technical.effects.title")}>
                {effectKeys && effectKeys.length > 0 ? (
                    effectKeys.map((effect) => (
                        <ToolSwitch
                            key={effect}
                            title={Identifier.toDisplay(effect)}
                            description={t(`effects:${effect}`)}
                            action={CoreAction.toggleValueInList("disabledEffects", effect)}
                            renderer={(el: EnchantmentProps) => !el.disabledEffects.includes(effect)}
                        />
                    ))
                ) : (
                    <h1 className="text-zinc-400 text-center py-4">{t("enchantment:technical.empty_effects")}</h1>
                )}
            </ToolSection>
        </div>
    );
}
