import LoadingSlot from "@/components/tools/elements/gui/LoadingSlot";

export default function SkeletonCraftingTableGUI() {
    return (
        <div className="p-4 flex justify-center">
            <div>
                <div className="w-40 mb-2 h-4 bg-zinc-700 rounded-md animate-pulse" />
                <div className="flex justify-between items-center w-72">
                    <div className="w-42 flex flex-wrap">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <LoadingSlot key={index.toString()} />
                        ))}
                    </div>
                    <img src="/images/features/gui/arrow.webp" alt="loading arrow" width={32} height={27} />
                    <LoadingSlot />
                </div>
            </div>
        </div>
    );
}
