import { Identifier } from "@voxelio/breeze";
import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { BoxHovered, BoxHoveredContent, BoxHoveredTrigger } from "@/components/ui/BoxHovered";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { getAllBlockIds, getBlockByRecipeType, getBlockConfig, isBlockId } from "@/lib/data/recipeConfig";
import { useTranslate } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CRAFTING_TYPE_KEYS = [
    "crafting_shaped",
    "crafting_shapeless",
    "crafting_transmute",
    "smithing_transform",
    "smithing_trim",
    "crafting_special_repairitem",
    "crafting_special_mapcloning",
    "crafting_special_mapextending",
    "crafting_special_shielddecoration",
    "crafting_decorated_pot",
    "crafting_special_firework_rocket",
    "crafting_special_firework_star",
    "crafting_special_firework_star_fade",
    "crafting_special_tippedarrow",
    "crafting_special_armordye",
    "crafting_special_bannerduplicate",
    "crafting_special_bookcloning"
] as const;
const CRAFTING_TYPES = Object.fromEntries(
    CRAFTING_TYPE_KEYS.map((key) => [key, { name: `recipe:crafting.${key}.name`, description: `recipe:crafting.${key}.description` }])
);

export default function RecipeSelector(props: {
    value: string;
    onChange: (selection: string) => void;
    recipeCounts: Map<string, number>;
    selectMode?: boolean;
}) {
    const t = useTranslate();
    const blockIds = getAllBlockIds(true);
    const displayBlockId = isBlockId(props.value) ? props.value : getBlockByRecipeType(props.value).id;
    const displayName = isBlockId(props.value) ? t(getBlockConfig(props.value)?.name) : Identifier.toDisplay(props.value);

    return (
        <BoxHovered>
            <BoxHoveredTrigger>
                <div className="border-2 bg-zinc-950 border-zinc-800 rounded-lg flex items-center justify-center size-16 relative">
                    <TextureRenderer id={displayBlockId} />
                </div>
            </BoxHoveredTrigger>
            <BoxHoveredContent className="relative -translate-y-2 -translate-x-2">
                <div className="absolute inset-0 z-0 hue-rotate-45 starting:opacity-0 transition-all duration-500 brightness-20">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>
                <div className="absolute inset-0 z-0 hue-rotate-45 rotate-180 starting:opacity-0 transition-all duration-500 brightness-10">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>

                <div className="flex flex-col gap-2 relative z-20">
                    <div className="flex items-center justify-between gap-16">
                        <div className="grid">
                            <p className="text-lg font-bold">{t("recipe:selector.title")}</p>
                            <span className="text-xs text-zinc-400">{displayName}</span>
                        </div>
                        <div className="size-12">
                            <TextureRenderer id={displayBlockId} />
                        </div>
                    </div>
                    <hr />
                    <div className="grid grid-cols-3 gap-2">
                        {blockIds.map((blockId) => {
                            const count = props.recipeCounts.get(blockId) || 0;
                            const isEnabled = props.selectMode || count > 0;
                            return (
                                <button
                                    type="button"
                                    onClick={() => isEnabled && props.onChange(blockId)}
                                    key={blockId}
                                    className={cn(
                                        "border-2 bg-zinc-950 border-zinc-900 rounded-lg flex items-center justify-center size-16 transition-colors relative",
                                        isEnabled && "hover:border-zinc-800 hover:bg-zinc-900 cursor-pointer",
                                        !isEnabled && "opacity-50 cursor-not-allowed",
                                        props.value === blockId && "border-zinc-800 bg-zinc-900"
                                    )}>
                                    <TextureRenderer id={blockId} />
                                    {(!props.selectMode || count > 0) && (
                                        <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-600 rounded text-xs px-1 text-zinc-300">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <hr className="m-0" />
                    <div className="flex items-center justify-between">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost_border" className="justify-between w-full">
                                    <span>{t("recipe:selector.advanced")}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-chevron-down">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.entries(CRAFTING_TYPES).map(([craftingType, value]) => (
                                    <DropdownMenuItem
                                        key={craftingType}
                                        onClick={() => props.onChange(`minecraft:${craftingType}`)}
                                        description={t(value.description)}>
                                        {t(value.name)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </BoxHoveredContent>
        </BoxHovered>
    );
}
