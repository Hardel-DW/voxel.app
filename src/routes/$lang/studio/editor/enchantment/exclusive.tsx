import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExclusiveGroupSection } from "@/components/tools/concept/enchantment/ExclusiveGroupSection";
import { ExclusiveSingleSection } from "@/components/tools/concept/enchantment/ExclusiveSingleSection";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/exclusive")({
    component: EnchantmentExclusivePage
});

function EnchantmentExclusivePage() {
    const [mode, setMode] = useState<string>("group");
    const t = useTranslate();
    const elements = [
        { id: "group", title: t("enchantment:toggle.group.title") },
        { id: "single", title: t("enchantment:toggle.individual.title") }
    ];

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="flex items flex-col pt-4 h-full">
                <ToolSectionSelector
                    id="exclusive"
                    title={t("enchantment:section.exclusive.description")}
                    elements={elements}
                    value={mode}
                    setValue={(value) => setMode(value)}>
                    {mode === "group" && <ExclusiveGroupSection />}
                    {mode === "single" && <ExclusiveSingleSection />}
                </ToolSectionSelector>
            </div>
        </div>
    );
}
