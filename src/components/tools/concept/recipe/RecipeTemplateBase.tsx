import RecipeSlot from "@/components/tools/concept/recipe/RecipeSlot";

interface RecipeTemplateBaseProps {
    result: { item: string; count?: number };
    children: React.ReactNode;
}

export default function RecipeTemplateBase({ result, children }: RecipeTemplateBaseProps) {
    return (
        <div className="flex items-center justify-center gap-4 p-4 border border-zinc-700 rounded-lg bg-zinc-900/50 h-full">
            {children}

            <div className="size-12 flex items-center justify-center">
                <img src="/images/features/gui/progress.png" alt="Arrow" className="object-contain size-8 pixelated" />
            </div>

            <RecipeSlot item={result.item} count={result.count} isResult={true} />
        </div>
    );
}
