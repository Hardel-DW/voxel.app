import { ContentCard } from "@/components/home/sections/ContentCard";
import AsyncContent from "@/components/ui/AsyncContent";
import Pagination, { type PageState } from "@/components/ui/Pagination";
import { convertIconToSrc, PAGE_SIZE, type PackContent, type WorldInfo } from "@/lib/utils/instance";

type LoadablePageState<T> = PageState<T> & { load: (page?: number) => void };

interface WorldRowProps {
    world: WorldInfo;
    expanded: boolean;
    datapacks: LoadablePageState<PackContent>;
    onExpand: () => void;
    onConfigure: (pack: PackContent) => void;
}

export default function WorldRow({ world, expanded, datapacks, onExpand, onConfigure }: WorldRowProps) {
    return (
        <div className="flex flex-col gap-1">
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
                <div className="ml-8 flex flex-col gap-1">
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
                            onPageChange={(p) => datapacks.load(p)}
                        />
                    </AsyncContent>
                </div>
            )}
        </div>
    );
}
