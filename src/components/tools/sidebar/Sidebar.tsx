
import ExportButton from "@/components/tools/sidebar/ExportButton";
import GitButton from "@/components/tools/sidebar/GitButton";
import SidebarCard from "@/components/tools/sidebar/SidebarCard";
import { CONCEPTS } from "@/lib/data/elements";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import SettingsButton from "@/components/tools/sidebar/SettingsButton";

export default function StudioSidebar() {
    const hasElements = useConfiguratorStore((state) => Object.keys(state.files).length > 0);
    if (!hasElements) return null;

    return (
        <div className="flex flex-col pb-4 size-full">
            <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin flex flex-col items-center">
                <div className="flex flex-col gap-3 mt-4 w-full max-w-[280px] mx-auto">
                    {CONCEPTS.map((concept) => (
                        <SidebarCard key={concept.registry} image={concept.image} registry={concept.registry} overview={concept.overview} />
                    ))}
                </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-2 mt-2 transition-all duration-300 w-full justify-center max-w-[280px] mx-auto">
                <SettingsButton />
                <GitButton />
                <ExportButton />
            </div>
        </div>
    );
}
