import { Link, useParams } from "@tanstack/react-router";
import type { InstanceInfo, WorldInfo } from "@/lib/utils/instance/types";
import { getVersionBackground } from "@/lib/utils/instance/worlds";

function isInstanceInfo(data: InstanceInfo | WorldInfo): data is InstanceInfo {
    return "iconUrl" in data;
}

interface GameCardProps {
    data: InstanceInfo | WorldInfo;
    instancePath?: string;
}

export default function GameCard({ data, instancePath }: GameCardProps) {
    const { lang } = useParams({ from: "/$lang" });
    const isWorld = instancePath !== undefined;
    const searchParams = isWorld ? { path: instancePath, name: data.name, world: data.path } : { path: data.path, name: data.name };
    const imageSrc = isInstanceInfo(data) && data.iconUrl ? data.iconUrl : getVersionBackground(data.versionId);

    return (
        <Link
            to="/$lang/world"
            params={{ lang }}
            search={searchParams}
            className="group flex flex-col rounded-xl shadow-lg shadow-zinc-950/20 bg-zinc-900/40 border border-zinc-800/50 min-w-48 max-w-48 overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="overflow-hidden aspect-video bg-zinc-800/50">
                <img
                    src={imageSrc}
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
