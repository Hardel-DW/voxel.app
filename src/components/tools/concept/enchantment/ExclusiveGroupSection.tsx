import type { TagType } from "@voxelio/breeze";
import { CoreAction, Identifier, Tags, TagsProcessor } from "@voxelio/breeze";
import EnchantmentTags from "@/components/tools/concept/enchantment/EnchantmentTags";
import type { TagsEnchantmentActionProps } from "@/components/tools/concept/enchantment/TagsEnchantmentAction";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import Loader from "@/components/ui/Loader";
import { exclusiveSetGroups } from "@/lib/data/exclusive";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { useNavigationStore } from "@/lib/store/NavigationStore";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { isMinecraft } from "@/lib/utils/lock";

export function ExclusiveGroupSection() {
    const t = useTranslate();
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<TagType>>("summary", "tags/enchantment");
    const currentElementId = useNavigationStore((state) => state.currentElementId);
    const getRegistry = useConfiguratorStore((state) => state.getRegistry);
    if (!currentElementId) return null;

    const tagsRegistry = getRegistry<TagType>("tags/enchantment", { path: "exclusive_set" });
    const vanillaTags = data
        ? Object.entries(data).map(([key, value]) => ({ identifier: Identifier.of(key, "tags/enchantment"), data: value }))
        : [];

    const merge = TagsProcessor.merge([
        { id: "vanilla", tags: vanillaTags },
        { id: "datapack", tags: tagsRegistry }
    ]);

    const createActions = (value: string): TagsEnchantmentActionProps[] => [
        {
            title: "enchantment:exclusive.actions.target.title",
            subtitle: "enchantment:exclusive.actions.target.subtitle",
            description: "enchantment:exclusive.actions.target.description",
            action: (isChecked: boolean) =>
                isChecked ? CoreAction.setValue("exclusiveSet", value) : CoreAction.setUndefined("exclusiveSet"),
            renderer: (el) => el.exclusiveSet === value
        },
        {
            title: "enchantment:exclusive.actions.membership.title",
            subtitle: "enchantment:exclusive.actions.membership.subtitle",
            description: "enchantment:exclusive.actions.membership.description",
            action: (isChecked: boolean) => (isChecked ? CoreAction.addTags([value]) : CoreAction.removeTags([value])),
            renderer: (el) => Array.isArray(el.tags) && el.tags.includes(value)
        }
    ];

    return (
        <>
            <ToolCategory title={t("enchantment:exclusive.vanilla.title")}>
                <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-64">
                    {exclusiveSetGroups.map(({ id, image, value }) => {
                        const tagData = merge.find((tag) =>
                            new Identifier(tag.identifier).equals(Identifier.of(value, "tags/enchantment"))
                        );
                        const values = tagData && Tags.isTag(tagData.data) ? new Tags(tagData.data).fromRegistry() : [];

                        return (
                            <EnchantmentTags
                                key={id}
                                title={t(`enchantment:exclusive.set.${id}.title`)}
                                description={t(`enchantment:exclusive.set.${id}.description`)}
                                image={`/images/features/item/${image}.webp`}
                                values={values}
                                lock={[isMinecraft]}
                                actions={createActions(value)}
                            />
                        );
                    })}
                </div>
            </ToolCategory>

            <ToolCategory title={t("enchantment:exclusive.custom.title")}>
                {merge.filter((tag) => tag.identifier.namespace !== "minecraft").length === 0 && (
                    <p className="text-zinc-400 p-4">{t("enchantment:exclusive.custom.fallback")}</p>
                )}

                {merge.filter((tag) => tag.identifier.namespace !== "minecraft").length > 0 && (
                    <div className="grid max-xl:grid-cols-1 gap-4 grid-auto-64">
                        {merge
                            .filter((tag) => tag.identifier.namespace !== "minecraft")
                            .map((tagEntry) => {
                                const identifier = new Identifier(tagEntry.identifier);
                                const values = Tags.isTag(tagEntry.data) ? new Tags(tagEntry.data).fromRegistry() : [];
                                const identifierString = identifier.toString();

                                return (
                                    <EnchantmentTags
                                        key={identifier.toUniqueKey()}
                                        title={identifier.toResourceName()}
                                        description={identifier.toResourcePath()}
                                        image="/icons/logo.svg"
                                        values={values}
                                        actions={createActions(identifierString)}
                                    />
                                );
                            })}
                    </div>
                )}
            </ToolCategory>

            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}
        </>
    );
}
