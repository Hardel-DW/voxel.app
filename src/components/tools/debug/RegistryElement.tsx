import { FILE_STATUS, Identifier } from "@voxelio/breeze";
import { useDebugStore } from "@/components/tools/debug/DebugStore";
import { cn } from "@/lib/utils";

interface RegistryElementProps {
    uniqueKey: string;
    selectedElement: string | undefined;
    onElementSelect: (uniqueKey: string) => void;
}

export function RegistryElement({ uniqueKey, selectedElement, onElementSelect }: RegistryElementProps) {
    const fileStatusComparator = useDebugStore((state) => state.fileStatusComparator);
    const fileStatus = fileStatusComparator?.getFileStatus(uniqueKey);
    const identifier = Identifier.fromUniqueKey(uniqueKey);
    const isSelected = selectedElement === uniqueKey;

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onElementSelect(uniqueKey);
        }
    };

    return (
        <button
            type="button"
            onClick={() => onElementSelect(uniqueKey)}
            onKeyDown={handleKeyDown}
            className={cn(
                "border-zinc-800 relative cursor-pointer border-t border-b rounded-lg p-2 bg-zinc-900/10 hover:bg-zinc-800/10 transition-colors w-full text-left",
                {
                    "border-red-950": fileStatus === FILE_STATUS.DELETED,
                    "border-green-950": fileStatus === FILE_STATUS.ADDED,
                    "border-blue-950": fileStatus === FILE_STATUS.UPDATED
                }
            )}>
            <kbd className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-800/80 text-[0.65rem] text-zinc-400 font-mono border border-zinc-700">
                {identifier.toNamespace()}
            </kbd>
            <div className={isSelected ? "text-rose-500" : "text-white"}>{identifier.toResourceName()}</div>
            <small className="text-xs text-gray-400">{identifier.toString()}</small>
        </button>
    );
}
