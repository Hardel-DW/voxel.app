import { createFileRoute } from "@tanstack/react-router";
import RecipeInventory from "@/components/tools/concept/recipe/RecipeInventory";
import RecipeSection from "@/components/tools/concept/recipe/RecipeSection";

export const Route = createFileRoute("/$lang/studio/editor/recipe/main")({
    component: RecipeMainPage
});

function RecipeMainPage() {
    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-8 items-start">
                <RecipeSection />
                <RecipeInventory />
            </div>
        </div>
    );
}
