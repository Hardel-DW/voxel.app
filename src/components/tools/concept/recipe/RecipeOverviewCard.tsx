import { Link } from "@tanstack/react-router";
import type { RecipeProps } from "@voxelio/breeze";
import RecipeRenderer from "@/components/tools/concept/recipe/RecipeRenderer";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import { useConfiguratorStore } from "@/components/tools/Store";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { t } from "@/lib/i18n";

export default function RecipeOverviewCard(props: { element: RecipeProps; elementId: string }) {
    const handleConfigure = () => useConfiguratorStore.getState().setCurrentElementId(props.elementId);

    return (
        <ErrorBoundary fallback={(e) => <ErrorPlaceholder error={e} />}>
            <div className="bg-black/35 border-t-2 border-l-2 border-stone-900 select-none relative transition-all hover:ring-1 ring-zinc-900 rounded-xl p-4 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <RecipeRenderer element={props.element} />

                    <div className="pt-4 border-t border-zinc-800/50 mt-auto">
                        <Link
                            to="/editor/recipe/main"
                            onClick={handleConfigure}
                            className="w-full cursor-pointer bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition-colors block text-center">
                            {t("configure")}
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 brightness-30 rounded-xl overflow-hidden">
                    <img src="/images/shine.avif" alt="Shine" className="w-full h-full object-cover" loading="lazy" />
                </div>
            </div>
        </ErrorBoundary>
    );
}
