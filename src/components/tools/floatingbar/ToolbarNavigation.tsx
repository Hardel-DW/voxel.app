import { useConfiguratorStore } from "@/components/tools/Store";

export function ToolbarNavigation() {
    const { navigationHistory, navigationIndex, back, forward } = useConfiguratorStore();
    const canGoBack = navigationIndex > 0;
    const canGoForward = navigationIndex < navigationHistory.length - 1;

    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                onClick={back}
                disabled={!canGoBack}
                className="size-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10">
                <img src="/icons/arrow-left.svg" alt="Back" className="size-4 invert opacity-70" />
            </button>
            <button
                type="button"
                onClick={forward}
                disabled={!canGoForward}
                className="size-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10">
                <img src="/icons/arrow-right.svg" alt="Forward" className="size-4 invert opacity-70" />
            </button>
        </div>
    );
}
