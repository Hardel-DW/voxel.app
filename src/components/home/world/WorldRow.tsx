import { ContentCard } from "@/components/home/sections/ContentCard";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination, { type PageState } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";
import type { PackContent, WorldInfo } from "@/lib/utils/instance/types";
import { PAGE_SIZE } from "@/lib/utils/instance/worlds";

type LoadablePageState<T, C = undefined> = PageState<T> & { load: (page?: number, context?: C) => void };

interface WorldRowProps {
    world: WorldInfo;
    expanded: boolean;
    datapacks: LoadablePageState<PackContent, string>;
    onExpand: () => void;
    onConfigure: (pack: PackContent) => void;
}

export default function WorldRow({ world, expanded, datapacks, onExpand, onConfigure }: WorldRowProps) {
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
                    <AsyncContent loading={datapacks.loading} empty={datapacks.items.length === 0}>
                        {datapacks.items.map((dp) => (
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
                            page={datapacks.page}
                            total={datapacks.total}
                            pageSize={PAGE_SIZE}
                            loading={datapacks.loading}
                            onPageChange={(p) => datapacks.load(p, world.path)}
                        />
                    </AsyncContent>
                </div>
            )}
        </div>
    );
}
