import { ContentCard } from "@/components/home/sections/ContentCard";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";
import type { PackContent, PaginatedResult, WorldInfo } from "@/lib/utils/instance/types";
import { PAGE_SIZE } from "@/lib/utils/instance/worlds";

interface WorldRowProps {
    world: WorldInfo;
    expanded: boolean;
    datapacks: PaginatedResult<PackContent> | undefined;
    datapacksLoading: boolean;
    datapacksPage: number;
    onExpand: () => void;
    onConfigure: (pack: PackContent) => void;
    onDatapacksPageChange: (page: number) => void;
}

export default function WorldRow({
    world,
    expanded,
    datapacks,
    datapacksLoading,
    datapacksPage,
    onExpand,
    onConfigure,
    onDatapacksPageChange
}: WorldRowProps) {
    const items = datapacks?.items ?? [];
    const total = datapacks?.total ?? 0;

    return (
        <div
            className={cn(
                "flex flex-col rounded-2xl transition-all duration-300 border-zinc-800/60",
                expanded && "bg-zinc-900/40 border p-2"
            )}>
            <ContentCard
                title={world.name}
                iconSrc={convertIconToSrc(world.iconPath)}
                type="World"
                path={world.path}
                expanded={expanded}
                onExpand={onExpand}
                expandable
            />
            {expanded && (
                <div className="mt-2 pl-6 flex flex-col gap-1.5 border-l-2 border-zinc-700/50 ml-7">
                    <AsyncContent loading={datapacksLoading} empty={items.length === 0}>
                        {items.map((dp) => (
                            <ContentCard
                                key={dp.path}
                                title={dp.name}
                                iconSrc={convertIconToSrc(dp.iconPath)}
                                type="Datapack"
                                path={dp.path}
                                onConfigure={() => onConfigure(dp)}
                            />
                        ))}
                        <Pagination
                            page={datapacksPage}
                            total={total}
                            pageSize={PAGE_SIZE}
                            loading={datapacksLoading}
                            onPageChange={onDatapacksPageChange}
                        />
                    </AsyncContent>
                </div>
            )}
        </div>
    );
}
