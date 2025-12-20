import RecipeSlot from "@/components/tools/concept/recipe/RecipeSlot";
import RecipeTemplateBase from "@/components/tools/concept/recipe/RecipeTemplateBase";

interface SmithingTemplateProps {
    slots: Record<string, string[] | string>;
    result: { item: string; count?: number };
}

export default function SmithingTemplate({ slots, result }: SmithingTemplateProps) {
    return (
        <RecipeTemplateBase result={result}>
            <div className="flex gap-1 w-full h-full">
                {[0, 1, 2].map((slotIndex) => (
                    <RecipeSlot key={slotIndex} item={slots[slotIndex.toString()]} />
                ))}
            </div>
        </RecipeTemplateBase>
    );
}
