import { cn } from "@/lib/utils";
import { convertIconToSrc } from "@/lib/utils/instance/helpers";

export default function Avatar(props: { name: string; icon?: string; className?: string }) {
    const iconSrc = convertIconToSrc(props.icon ?? null);
    return (
        <div className={cn("size-10 rounded-xl flex items-center justify-center", props.className)}>
            {iconSrc ? (
                <img src={iconSrc} alt={props.name} className="size-full object-cover" />
            ) : (
                <span className="text-xs font-bold text-zinc-500">{props.name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}
