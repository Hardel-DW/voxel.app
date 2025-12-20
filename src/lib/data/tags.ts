import { Identifier } from "@voxelio/breeze";

type TagDef = { tag: string; min?: number; max?: number };

const definitions: Record<string, TagDef> = {
    sword: { tag: "#minecraft:enchantable/sword", max: 89 },
    sweeping: { tag: "#minecraft:enchantable/sweeping", min: 90 },
    melee_weapon: { tag: "#minecraft:enchantable/melee_weapon", min: 90 },
    lunge: { tag: "#minecraft:enchantable/lunge", min: 90 },
    trident: { tag: "#minecraft:enchantable/trident" },
    mace: { tag: "#minecraft:enchantable/mace" },
    bow: { tag: "#minecraft:enchantable/bow" },
    crossbow: { tag: "#minecraft:enchantable/crossbow" },
    range: { tag: "#voxel:enchantable/range" },
    fishing: { tag: "#minecraft:enchantable/fishing" },
    shield: { tag: "#voxel:enchantable/shield" },
    weapon: { tag: "#minecraft:enchantable/weapon" },
    melee: { tag: "#voxel:enchantable/melee" },
    head_armor: { tag: "#minecraft:enchantable/head_armor" },
    chest_armor: { tag: "#minecraft:enchantable/chest_armor" },
    leg_armor: { tag: "#minecraft:enchantable/leg_armor" },
    foot_armor: { tag: "#minecraft:enchantable/foot_armor" },
    elytra: { tag: "#voxel:enchantable/elytra" },
    armor: { tag: "#minecraft:enchantable/armor" },
    equippable: { tag: "#minecraft:enchantable/equippable" },
    axes: { tag: "#voxel:enchantable/axes" },
    shovels: { tag: "#voxel:enchantable/shovels" },
    hoes: { tag: "#voxel:enchantable/hoes" },
    pickaxes: { tag: "#voxel:enchantable/pickaxes" },
    durability: { tag: "#minecraft:enchantable/durability" },
    mining_loot: { tag: "#minecraft:enchantable/mining_loot" }
};

function isInRange(def: TagDef, version: number) {
    return (def.min ?? 0) <= version && version <= (def.max ?? Infinity);
}

export function getEnchantableItems(version: number) {
    return Object.fromEntries(
        Object.entries(definitions)
            .filter(([, def]) => isInRange(def, version))
            .map(([key, def]) => [key, Identifier.of(def.tag, "tags/item")])
    ) as Record<string, Identifier>;
}

export function getEnchantableKeys(version: number) {
    return Object.keys(definitions).filter((key) => isInRange(definitions[key], version));
}

export function getEnchantableEntries(version: number) {
    return Object.entries(getEnchantableItems(version));
}
