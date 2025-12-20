import { EnchantmentAction, type EnchantmentProps, type Identifier } from "@voxelio/breeze";
import ToolCategory from "@/components/tools/elements/ToolCategory";
import ToolGrid from "@/components/tools/elements/ToolGrid";
import ToolInline from "@/components/tools/elements/ToolInline";

interface EnchantmentCategoryProps {
    title: string;
    identifiers: Identifier[];
}

export function EnchantmentCategory({ title, identifiers }: EnchantmentCategoryProps) {
    return (
        <ToolCategory title={title}>
            <ToolGrid>
                {identifiers.map((identifier) => (
                    <ToolInline
                        key={identifier.toUniqueKey()}
                        title={identifier.toResourceName()}
                        description={identifier.namespace}
                        action={EnchantmentAction.toggleEnchantmentToExclusiveSet(identifier.toString())}
                        renderer={(el: EnchantmentProps) =>
                            Array.isArray(el.exclusiveSet)
                                ? el.exclusiveSet.includes(identifier.toString())
                                : el.exclusiveSet === identifier.toString()
                        }
                    />
                ))}
            </ToolGrid>
        </ToolCategory>
    );
}
