import RecipeSlot from "@/components/tools/concept/recipe/RecipeSlot";
import RecipeTemplateBase from "@/components/tools/concept/recipe/RecipeTemplateBase";

interface SmeltingTemplateProps {
    slots: Record<string, string[] | string>;
    result: { item: string; count?: number };
}

export default function SmeltingTemplate({ slots, result }: SmeltingTemplateProps) {
    return (
        <RecipeTemplateBase result={result}>
            <div className="flex flex-col gap-1 w-full h-full">
                <RecipeSlot item={slots["0"]} />
                <div className="size-12 flex items-center justify-center">
                    <img src="/images/features/gui/burn_progres.png" alt="Flame" className="object-contain size-8 pixelated" />
                </div>
                <RecipeSlot isEmpty={true} />
            </div>
        </RecipeTemplateBase>
    );
}
