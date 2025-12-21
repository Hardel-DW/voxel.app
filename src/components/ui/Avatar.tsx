import { cn } from "@/lib/utils";

export default function Avatar(props: { name: string; icon?: string; className?: string }) {
    return (
        <div className={cn("size-10 rounded-xl flex items-center justify-center", props.className)}>
            {props.icon ? (
                <img src={props.icon} alt={props.name} className="size-full object-cover" />
            ) : (
                <span className="text-xs font-bold text-zinc-500">{props.name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}
