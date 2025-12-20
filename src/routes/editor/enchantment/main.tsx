import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import Donation from "@/components/tools/elements/Donation";
import TemplateCard from "@/components/tools/elements/TemplateCard";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import { isMinecraft } from "@/lib/utils/lock";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/editor/enchantment/main")({
    component: EnchantmentMainPage
});

function EnchantmentMainPage() {
    return (
        <div className="py-4 px-8 h-full overflow-y-auto flex flex-col gap-8">
            <ToolSection id="main" title={t("enchantment.section.global.description")}>
                <ToolGrid>
                    {["maxLevel", "weight", "anvilCost"].map((key, index) => (
                        <TemplateCard
                            key={key}
                            image={`/icons/tools/${key}.svg`}
                            title={t(`enchantment.global.${key}.title`)}
                            description={t(`enchantment.global.explanation.list.${index + 1}`)}>
                            <ToolCounter
                                min={1}
                                max={127}
                                step={1}
                                action={(value: number) => CoreAction.setValue(key, value)}
                                renderer={(el: EnchantmentProps) => el[key]}
                            />
                        </TemplateCard>
                    ))}
                </ToolGrid>
                <ToolSelector
                    key="mode-selector"
                    title={t("enchantment.global.mode.title")}
                    description={t("enchantment.global.mode.description")}
                    lock={[isMinecraft]}
                    action={(value: string) => CoreAction.setValue("mode", value)}
                    renderer={(el: EnchantmentProps) => el.mode}
                    options={[
                        {
                            label: t("enchantment.global.mode.enum.normal"),
                            value: "normal"
                        },
                        {
                            label: t("enchantment.global.mode.enum.soft_delete"),
                            value: "soft_delete"
                        },
                        {
                            label: t("enchantment.global.mode.enum.only_creative"),
                            value: "only_creative"
                        }
                    ]}
                />
            </ToolSection>
            <Donation
                key="donation"
                icon="/icons/logo.svg"
                title={t("supports.title")}
                description={t("supports.description")}
                subTitle={t("supports.advantages")}
                extra={[
                    t("supports.advantages.early_access"),
                    t("supports.advantages.submit_ideas"),
                    t("supports.advantages.discord_role"),
                    t("supports.advantages.live_voxel")
                ]}
                patreon={{
                    text: t("supports.become"),
                    link: "https://www.patreon.com/hardel"
                }}
                tipText={{
                    text: t("donate"),
                    link: "https://streamelements.com/hardoudou/tip"
                }}
            />
        </div>
    );
}
