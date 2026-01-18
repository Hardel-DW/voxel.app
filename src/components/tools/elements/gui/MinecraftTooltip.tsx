import { type Identifier, toRoman } from "@voxelio/breeze";
import { cn } from "@/lib/utils";

export type EnchantmentTooltipEntry = {
    enchantment: Identifier;
    level: number;
};

interface MinecraftTooltipProps {
    categories?: string[];
    lores?: string[];
    name: Identifier;
    enchantments?: EnchantmentTooltipEntry[];
    className?: string;
}

export default function MinecraftTooltip(props: MinecraftTooltipProps) {
    return (
        <div
            className={cn(
                "relative mx-1 my-[0.1rem] p-1.5 pointer-events-none z-10 bg-[#100010f0] after:absolute after:top-[0.1rem] after:-right-[0.1rem] after:bottom-[0.1rem] after:-left-[0.1rem] after:border-[0.1rem] after:border-[#100010f0] border-none-solid before:right-0 before:left-0 before:top-[0.1rem] before:bottom-[0.1rem] tooltip-border",
                props.className
            )}>
            <div className="font-seven text-base text-white whitespace-nowrap text-left word-spacing">
                <div className="text-name text-shadow-tooltip text-shadow-[#3e3e3e] ">{props.name.toResourceName()}</div>
                {props.lores && props.lores.length > 0 && (
                    <div className="text-base mt-[0.2em] text-lore text-shadow-tooltip text-shadow-[#151415]">
                        {props.lores.map((lore) => (
                            <div key={lore}>{lore}</div>
                        ))}
                    </div>
                )}

                {props.enchantments && props.enchantments.length > 0 && (
                    <div className="text-base mt-[0.2em] text-enchant text-shadow-tooltip text-shadow-enchant-shadow">
                        {props.enchantments.map((enchantment) => (
                            <div key={enchantment.enchantment.toUniqueKey()}>
                                {enchantment.enchantment.toResourceName()} {toRoman(enchantment.level)}
                            </div>
                        ))}
                    </div>
                )}

                {props.categories && props.categories.length > 0 && (
                    <div className="mt-2">
                        {props.categories.map((category) => (
                            <div key={category} className="text-attribute text-shadow-tooltip text-shadow-[#15153e]">
                                {category}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
