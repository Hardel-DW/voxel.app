import { createFileRoute } from "@tanstack/react-router";
import type { EnchantmentProps } from "@voxelio/breeze";
import { CoreAction } from "@voxelio/breeze";
import ToolCard from "@/components/tools/elements/ToolCard";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolSlot from "@/components/tools/elements/ToolSlot";
import { useTranslate } from "@/lib/i18n";

const world = {
    overworld: "#nova_structures:structure/overworld",
    underwater: "#nova_structures:structure/underwater",
    nether: "#nova_structures:structure/nether",
    end: "#nova_structures:structure/end"
};

const structures = {
    creeping_crypt: "#nova_structures:structure/creeping_crypt",
    nether_keep: "#nova_structures:structure/nether_keep",
    illager: "#nova_structures:structure/illager",
    illager_outpost: "#nova_structures:structure/illager_outpost",
    pale_residence: "#nova_structures:structure/pale_residence",
    shrine: "#nova_structures:structure/shrine",
    shrine_ominous: "#nova_structures:structure/shrine_ominous",
    snowy: "#nova_structures:structure/snowy",
    toxic_lair: "#nova_structures:structure/toxic_lair"
};

export const Route = createFileRoute("/$lang/studio/editor/enchantment/dnt")({
    component: EnchantmentDNTPage
});

function EnchantmentDNTPage() {
    const t = useTranslate();

    return (
        <div className="p-8 h-full overflow-y-auto">
            <ToolCategory title="dnt:globals">
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-64">
                    {Object.entries(world).map(([key, value]) => (
                        <ToolSlot
                            key={value}
                            title={t(`dnt:${key}.title`)}
                            description={t(`dnt:${key}.description`)}
                            image={`/images/features/structure/${key}.webp`}
                            size={128}
                            action={CoreAction.toggleValueInList("tags", value)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value)}
                        />
                    ))}
                </div>
            </ToolCategory>

            <ToolCategory title="dnt:structures">
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-100">
                    {Object.entries(structures).map(([key, value]) => (
                        <ToolCard
                            key={value}
                            title={t(`dnt:${key}.title`)}
                            description={t(`dnt:${key}.description`)}
                            image={`/images/addons/card/dnt/${key}.webp`}
                            action={CoreAction.toggleValueInList("tags", value)}
                            renderer={(el: EnchantmentProps) => el.tags.includes(value)}
                        />
                    ))}
                </div>
            </ToolCategory>
        </div>
    );
}
