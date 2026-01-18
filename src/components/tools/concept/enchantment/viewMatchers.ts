import type { EnchantmentProps } from "@voxelio/breeze";
import { Identifier } from "@voxelio/breeze";
import { SLOT_CONFIGS } from "@/lib/data/slots";
import { getEnchantableEntries } from "@/lib/data/tags";
import { toArray } from "@/lib/utils";

const matchesSlot = (el: EnchantmentProps, category: string) => {
    const config = SLOT_CONFIGS.find((s) => s.id === category);
    return config ? el.slots.some((s) => config.slots.includes(s)) : false;
};

const matchesItem = (el: EnchantmentProps, category: string, version: number) => {
    const entry = getEnchantableEntries(version).find(([k]) => k === category);
    if (!entry) return false;
    const tag = entry[1].toString();
    const allTags = [...toArray(el.supportedItems), ...toArray(el.primaryItems), ...toArray(el.tags)];
    return allTags.includes(tag);
};

const matchesExclusive = (el: EnchantmentProps, category: string) => {
    const sets = toArray(el.exclusiveSet);
    return sets.some((s) => (s.startsWith("#") ? s : Identifier.toDisplay(s)) === category);
};

export type ViewMatcher = (el: EnchantmentProps, cat: string, version: number) => boolean;

export const viewMatchers: Record<string, ViewMatcher> = {
    slots: matchesSlot,
    items: matchesItem,
    exclusive: matchesExclusive
};
