import { Link } from "@tanstack/react-router";
import type { GameInstance, WorldData } from "@/components/home/HomeStore";
import { convertIconToSrc } from "@/lib/utils/instance";

type GameCardProps = { type: "world"; world: WorldData } | { type: "instance"; instance: GameInstance; firstWorld?: WorldData };

export default function GameCard(props: GameCardProps) {
    const isWorld = props.type === "world";
    const name = isWorld ? props.world.name : props.instance.name;
    const instanceId = isWorld ? props.world.instanceId : props.instance.id;
    const timestamp = isWorld ? props.world.lastPlayed : props.instance.lastModified;
    const iconPath = isWorld ? props.world.iconPath : (props.firstWorld?.iconPath ?? props.instance.iconPath);
    const iconSrc = convertIconToSrc(iconPath);
    const formattedDate = new Date(timestamp).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric"
    });

    return (
        <Link
            to="/world"
            search={{ instanceId }}
            className="group flex flex-col rounded-xl shadow-lg shadow-zinc-950/20 bg-zinc-900/40 border border-zinc-800/50 min-w-48 max-w-48 overflow-hidden cursor-pointer hover:border-zinc-700 transition-colors">
            <div className="overflow-hidden aspect-video bg-zinc-800/50">
                <div className="w-full h-full flex items-center justify-center bg-zinc-800/30">
                    <img
                        src={iconSrc ?? "/icons/world.svg"}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </div>
            <div className="p-2.5">
                <p className="font-medium text-sm text-zinc-200 truncate">{name}</p>
                <p className="text-[10px] text-zinc-500">{formattedDate}</p>
            </div>
        </Link>
    );
}
