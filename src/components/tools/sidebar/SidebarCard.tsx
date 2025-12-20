import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { CONCEPT_KEY } from "@/components/tools/elements";
import { useConfiguratorStore } from "@/components/tools/Store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    children: React.ReactNode;
    image: { src: string; alt: string };
    index: number;
    registry: CONCEPT_KEY;
    overview: string;
}

export default function SidebarCard(props: Props) {
    const location = useLocation();
    const navigate = useNavigate();
    const getConcept = useConfiguratorStore((state) => state.getConcept);
    const currentConcept = getConcept(location.pathname);
    const isSelected = currentConcept === props.registry;

    return (
        <div
            className={cn(
                "relative group/card mx-auto transition-all duration-300 ease-spring w-14 in-data-pinned:w-full",
                isSelected && "in-data-pinned:mb-12 z-10"
            )}>
            <Link
                to={isSelected ? location.pathname : props.overview}
                disabled={isSelected}
                className={cn(
                    "block relative rounded-2xl overflow-hidden transition-all duration-300 ease-spring border h-14 in-data-pinned:h-20 bg-zinc-900/50 border-zinc-900",
                    isSelected
                        ? "opacity-100 not-in-data-pinned:bg-zinc-700/5 not-in-data-pinned:border-zinc-800"
                        : "opacity-40 hover:opacity-100 not-in-data-pinned:bg-transparent not-in-data-pinned:border-transparent not-in-data-pinned:hover:border-zinc-800 not-in-data-pinned:hover:bg-white/5"
                )}>
                <div className="absolute inset-0 -z-10 brightness-30 not-in-data-pinned:hidden">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-spring opacity-100 scale-100 in-data-pinned:opacity-0 in-data-pinned:scale-90 in-data-pinned:pointer-events-none">
                    <img
                        src={props.image.src}
                        alt={props.image.alt}
                        className={cn("size-6 rounded-md object-contain transition-opacity", isSelected ? "opacity-100" : "opacity-80")}
                    />
                </div>

                <div className="absolute inset-0 flex items-center px-4 transition-all duration-300 ease-spring opacity-0 translate-x-4 in-data-pinned:opacity-100 in-data-pinned:translate-x-0 pointer-events-none in-data-pinned:pointer-events-auto">
                    <div className="w-[280px] flex items-center justify-between gap-4">
                        <div className="flex flex-col items-start min-w-0 flex-1">
                            <div
                                className={cn(
                                    "text-base font-semibold truncate w-full text-left tracking-tight",
                                    isSelected ? "text-white" : "text-zinc-400"
                                )}>
                                {props.title}
                            </div>
                            <p className="text-xs text-zinc-500 truncate w-full text-left font-medium">{props.children}</p>
                        </div>

                        <img
                            src={props.image.src}
                            alt={props.image.alt}
                            className="size-10 rounded-xl shadow-sm object-cover shrink-0 bg-zinc-950/30"
                        />
                    </div>
                </div>

                {isSelected && <div className="absolute inset-0 -z-10 bg-linear-to-tr from-white/5 to-transparent opacity-50" />}
            </Link>

            {isSelected && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 hidden in-data-pinned:block animate-fadein origin-top z-20">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate({ to: props.overview });
                        }}
                        className="flex items-center justify-center w-full rounded-xl cursor-pointer bg-zinc-900/80 hover:bg-zinc-800 border border-neutral-800 hover:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all shadow-lg backdrop-blur-sm">
                        {t("overview")}
                        <img src="/icons/arrow-right.svg" className="size-3 ml-2 opacity-50" alt="->" />
                    </button>
                </div>
            )}
        </div>
    );
}
