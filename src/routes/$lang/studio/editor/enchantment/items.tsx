import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import { useState } from "react";
import ToolSectionSelector from "@/components/tools/elements/ToolSectionSelector";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { getEnchantableEntries } from "@/lib/data/tags";
import { VOXEL_TAGS } from "@/lib/data/voxel";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/items")({
    component: EnchantmentItemsPage
});

function EnchantmentItemsPage() {
    const t = useTranslate();
    const [section, setSection] = useState<string>("supportedItems");
    const addFile = useConfiguratorStore((state) => state.addFile);
    const version = useConfiguratorStore((state) => state.version) ?? 61;
    const elements = [
        { id: "supportedItems", title: t("enchantment:toggle.supported.title") },
        { id: "primaryItems", title: t("enchantment:toggle.primary.title") }
    ];

    const addTagIfExists = (identifier: { toFilePath: () => string }) => {
        const tagData = VOXEL_TAGS.get(identifier.toFilePath());
        if (tagData) addFile(identifier.toFilePath(), tagData);
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolSectionSelector
                id="slots"
                title={t("enchantment:section.supported.description")}
                elements={elements}
                value={section}
                setValue={setSection}>
                <div className="grid max-xl:grid-cols-1 gap-4 pb-4 grid-auto-64">
                    {getEnchantableEntries(version).map(([key, identifier]) => {
                        const tag = identifier.toString();
                        return (
                            <ToolSlot
                                key={key}
                                title={t(`enchantment:supported.${key}.title`)}
                                image={`/images/features/item/${key}.webp`}
                                action={CoreAction.setValue(section, tag)}
                                renderer={(el: EnchantmentProps) => el[section] === tag}
                                onBeforeChange={() => addTagIfExists(identifier)}
                            />
                        );
                    })}

                    {section === "primaryItems" && (
                        <ToolSlot
                            title={t("enchantment:supported.none.title")}
                            image="/images/tools/cross.webp"
                            action={CoreAction.setUndefined("primaryItems")}
                            renderer={(el: EnchantmentProps) => el.primaryItems === undefined}
                        />
                    )}
                </div>
            </ToolSectionSelector>
        </div>
    );
}
