import { Link } from "@tanstack/react-router";
import type { InstanceInfo, WorldInfo } from "@/lib/utils/instance";
import { convertIconToSrc } from "@/lib/utils/instance";

type CardData = InstanceInfo | WorldInfo;

interface GameCardProps {
    data: CardData;
    instancePath?: string; // Required for worlds to navigate back to instance context
}

export default function GameCard({ data, instancePath }: GameCardProps) {
    const isWorld = instancePath !== undefined;
    const searchParams = isWorld ? { path: instancePath, name: data.name, world: data.path } : { path: data.path, name: data.name };

    return (
        <Link
            to="/world"
            search={searchParams}
            className="group flex flex-col rounded-xl shadow-lg shadow-zinc-950/20 bg-zinc-900/40 border border-zinc-800/50 min-w-48 max-w-48 overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="overflow-hidden aspect-video bg-zinc-800/50">
                <img
                    src={convertIconToSrc(data.iconPath) ?? "/icons/world.svg"}
                    alt={data.name}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-2.5">
                <p className="font-medium text-sm text-zinc-200 truncate">{data.name}</p>
            </div>
        </Link>
    );
}
