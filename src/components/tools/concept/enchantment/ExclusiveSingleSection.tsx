import { type Enchantment, Identifier } from "@voxelio/breeze";
import { EnchantmentCategory } from "@/components/tools/concept/enchantment/EnchantmentCategory";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import Loader from "@/components/ui/Loader";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useConfiguratorStore } from "@/lib/store/StudioStore";

export function ExclusiveSingleSection() {
    const enchantments = useConfiguratorStore((state) => state.getRegistry<Enchantment>("enchantment"));
    const { data, isLoading, isError } = useRegistry<FetchedRegistry<Enchantment>>("summary", "enchantment");
    const identifiers = enchantments.map((enchantment) => new Identifier(enchantment.identifier));
    const vanillaIdentifiers = Object.keys(data ?? {}).map((key) => Identifier.of(key, "enchantment"));

    return (
        <>
            <EnchantmentCategory title="enchantment:exclusive.custom.title" identifiers={identifiers} />
            {isLoading && <Loader />}
            {isError && <ErrorPlaceholder error={new Error("Erreur de chargement du registre.")} />}
            {vanillaIdentifiers.length > 0 && (
                <EnchantmentCategory title="enchantment:exclusive.vanilla.title" identifiers={vanillaIdentifiers} />
            )}
        </>
    );
}
