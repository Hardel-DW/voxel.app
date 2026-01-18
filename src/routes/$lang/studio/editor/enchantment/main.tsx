import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import TemplateCard from "@/components/tools/elements/TemplateCard";
import ToolCounter from "@/components/tools/elements/ToolCounter";
import ToolSection from "@/components/tools/elements/ToolSection";
import ToolSelector from "@/components/tools/elements/ToolSelector";
import { Button } from "@/components/ui/Button";
import { useTranslate } from "@/lib/i18n";
import { isMinecraft } from "@/lib/utils/lock";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/main")({
    component: EnchantmentMainPage
});

function EnchantmentMainPage() {
    const t = useTranslate();
    const advantages = ["early_access", "submit_ideas", "discord_role", "live_voxel"];

    return (
        <div className="py-4 px-8 h-full overflow-y-auto flex flex-col gap-8">
            <ToolSection id="main" title={t("enchantment:section.global.description")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-64">
                    {["maxLevel", "weight", "anvilCost"].map((key, index) => (
                        <TemplateCard
                            key={key}
                            image={`/icons/tools/${key}.svg`}
                            title={t(`enchantment:global.${key}.title`)}
                            description={t(`enchantment:global.explanation.list.${index + 1}`)}>
                            <ToolCounter
                                min={1}
                                max={127}
                                step={1}
                                action={(value: number) => CoreAction.setValue(key, value)}
                                renderer={(el: EnchantmentProps) => el[key]}
                            />
                        </TemplateCard>
                    ))}
                </div>
                <ToolSelector
                    title={t("enchantment:global.mode.title")}
                    description={t("enchantment:global.mode.description")}
                    lock={[isMinecraft]}
                    action={(value: string) => CoreAction.setValue("mode", value)}
                    renderer={(el: EnchantmentProps) => el.mode}
                    options={{
                        normal: t("enchantment:global.mode.enum.normal"),
                        soft_delete: t("enchantment:global.mode.enum.soft_delete"),
                        only_creative: t("enchantment:global.mode.enum.only_creative")
                    }}
                />
            </ToolSection>

            <div className="bg-black/35 border-t-2 border-l-2 rounded-2xl border-stone-900 ring-0 ring-zinc-800 overflow-hidden backdrop-blur-2xl relative mt-auto">
                <img className="absolute -top-24 -right-24 size-96 opacity-20" src="/icons/logo.svg" alt="Voxel Labs" />
                <div className="flex flex-col justify-between h-full p-8 pl-12">
                    <div>
                        <h1 className="text-white text-3xl tracking-wide font-semibold">{t("supports.title")}</h1>
                        <p className="text-zinc-400 text-sm pt-2 w-full lg:w-3/4">{t("supports.description")}</p>
                    </div>
                    <div className="xl:flex justify-between gap-4 mt-4">
                        <div>
                            <h3 className="text-white font-bold text-xl pb-4 pt-6">{t("supports.advantages")}</h3>
                            <ul className="grid grid-cols-2 gap-x-8 items-center *:flex *:items-center *:gap-2 gap-y-4">
                                {advantages.map((advantage) => (
                                    <li key={advantage}>
                                        <img src="/icons/check.svg" alt="check" className="w-4 h-4 invert" />
                                        <span className="text-zinc-300 text-sm font-semibold">{t(`supports.advantages.${advantage}`)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:flex-none self-end relative z-10 gap-4 pt-8">
                            <Button
                                className="w-full flex-1 px-8"
                                target="_blank"
                                rel="noreferrer"
                                href="https://streamelements.com/hardoudou/tip"
                                variant="shimmer">
                                {t("donate")}
                            </Button>
                            <Button
                                className="w-full flex-1 px-8"
                                variant="patreon"
                                href="https://www.patreon.com/hardel"
                                target="_blank"
                                rel="noreferrer">
                                <img src="/icons/company/patreon.svg" alt="Patreon" className="w-4 h-4" />
                                {t("supports.become")}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 hue-rotate-90 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>
            </div>
        </div>
    );
}
