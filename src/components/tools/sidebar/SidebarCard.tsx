import { Link, useLocation } from "@tanstack/react-router";
import type { CONCEPT_KEY } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import { cn } from "@/lib/utils";

interface Props {
    image: { src: string; alt: string };
    registry: CONCEPT_KEY;
    overview: string;
}

export default function SidebarCard(props: Props) {
    const location = useLocation();
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const currentConcept = getConcept(location.pathname);
    const isSelected = currentConcept === props.registry;

    return (
        <div className="relative mx-auto w-14">
            <Link
                to={isSelected ? location.pathname : props.overview}
                disabled={isSelected}
                className={cn(
                    "block relative rounded-2xl overflow-hidden transition-colors duration-300 ease-spring border-0 h-14 bg-transparent border-zinc-800",
                    isSelected && "bg-zinc-700/5 border"
                )}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={props.image.src}
                        alt={props.image.alt}
                        className={cn("size-6 rounded-md object-contain transition-opacity", isSelected ? "opacity-100" : "opacity-80")}
                    />
                </div>
            </Link>
        </div>
    );
}
