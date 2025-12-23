import { useNavigate } from "@tanstack/react-router";
import { Identifier } from "@voxelio/breeze";
import { CONCEPTS } from "@/components/tools/elements";
import { useConfiguratorStore, type OpenTab } from "@/components/tools/Store";
import { cn } from "@/lib/utils";

function TabItem({ tab, index, isActive }: { tab: OpenTab; index: number; isActive: boolean }) {
    const navigate = useNavigate();
    const switchTab = useConfiguratorStore((state) => state.switchTab);
    const closeTab = useConfiguratorStore((state) => state.closeTab);
    const isDirty = useConfiguratorStore((state) => state.isDirty);
    const icon = CONCEPTS.find((c) => tab.route.startsWith(`/editor/${c.registry}`))?.image.src

    const handleClick = () => {
        switchTab(index);
        navigate({ to: tab.route });
    };

    const handleClose = (e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        closeTab(index);
    };

    return (
        <div
            role="tab"
            tabIndex={0}
            aria-selected={isActive}
            onClick={handleClick}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            className={cn(
                "group relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer",
                "hover:bg-zinc-800/50",
                isActive ? "bg-zinc-800/80 text-zinc-100" : "text-zinc-400"
            )}>
            {icon && <img src={icon} alt="" className="size-4" />}
            {isDirty && isActive && <span className="size-2 rounded-full bg-amber-500" />}
            <span className="truncate max-w-48">{Identifier.fromUniqueKey(tab.elementId).toResourcePath()}</span>
            <button
                type="button"
                aria-label="Close tab"
                onClick={handleClose}
                onKeyDown={(e) => e.key === "Enter" && handleClose(e)}
                className={cn(
                    "size-4 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors",
                    "opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100"
                )}>
                <svg className="size-3" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M1.41 0L0 1.41 3.59 5 0 8.59 1.41 10 5 6.41 8.59 10 10 8.59 6.41 5 10 1.41 8.59 0 5 3.59 1.41 0z" />
                </svg>
            </button>
        </div>
    );
}

export default function EditorTabs() {
    const openTabs = useConfiguratorStore((state) => state.openTabs);
    const activeTabIndex = useConfiguratorStore((state) => state.activeTabIndex);

    if (openTabs.length === 0) return null;

    return (
        <div role="tablist" className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {openTabs.map((tab, index) => (
                <TabItem key={tab.elementId} tab={tab} index={index} isActive={index === activeTabIndex} />
            ))}
        </div>
    );
}
