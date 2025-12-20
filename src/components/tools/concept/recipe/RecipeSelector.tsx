import TextureRenderer from "@/components/tools/elements/texture/TextureRenderer";
import { BoxHovered, BoxHoveredContent, BoxHoveredTrigger } from "@/components/ui/BoxHovered";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";
import { getAllBlockIds, getDisplayBlockId, getDisplayName } from "./recipeConfig";

const CRAFTING_TYPES = {
    crafting_shaped: { name: "Shaped", description: "Craft with a specific pattern" },
    crafting_shapeless: { name: "Shapeless", description: "Craft in any order" },
    crafting_transmute: { name: "Transmute", description: "Transfer data from one item to another" },
    smithing_transform: { name: "Transform", description: "Give additional properties to an item" },
    smithing_trim: { name: "Trim", description: "Add a trim to an item" },
    crafting_special_repairitem: { name: "Repair Item", description: "Repair an item with another item" },
    crafting_special_mapcloning: { name: "Map Cloning", description: "Clone a map" },
    crafting_special_mapextending: { name: "Map Extending", description: "Extend a map" },
    crafting_special_shielddecoration: { name: "Shield Decoration", description: "Decorate a shield with a banner" },
    crafting_decorated_pot: { name: "Decorated Pot", description: "Craft a decorated pot with shard" },
    crafting_special_firework_rocket: { name: "Firework Rocket", description: "Used for crafting fireworks" },
    crafting_special_firework_star: { name: "Firework Star", description: "Used for crafting fireworks Star" },
    crafting_special_firework_star_fade: { name: "Firework Star Fade", description: "Used for crafting fireworks Star Fade" },
    crafting_special_tippedarrow: { name: "Tipped Arrow", description: "Craft a tipped arrow with a potion effect" },
    crafting_special_armordye: { name: "Armor Dye", description: "Dye leather armor" },
    crafting_special_bannerduplicate: { name: "Banner Duplicate", description: "Duplicate a banner pattern" },
    crafting_special_bookcloning: { name: "Book Cloning", description: "Clone a written book" }
};

export default function RecipeSelector(props: {
    value: string;
    onChange: (selection: string) => void;
    recipeCounts: Map<string, number>;
    selectMode?: boolean;
}) {
    const blockIds = getAllBlockIds(true);
    const displayBlockId = getDisplayBlockId(props.value);
    const displayName = getDisplayName(props.value);

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
                            <p className="text-lg font-bold">Select Recipe</p>
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
                                    <span>Advanced</span>
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
                                        key={value.name}
                                        onClick={() => props.onChange(`minecraft:${craftingType}`)}
                                        description={value.description}>
                                        {value.name}
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
