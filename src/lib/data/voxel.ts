import { Identifier } from "@voxelio/breeze";

const definitions = {
    "#voxel:enchantable/axes": ["#minecraft:axes"],
    "#voxel:enchantable/hoes": ["#minecraft:hoes"],
    "#voxel:enchantable/pickaxes": ["#minecraft:pickaxes"],
    "#voxel:enchantable/shovels": ["#minecraft:shovels"],
    "#voxel:enchantable/elytra": ["minecraft:elytra"],
    "#voxel:enchantable/melee": ["#minecraft:enchantable/weapon", "#minecraft:enchantable/trident"],
    "#voxel:enchantable/range": ["#minecraft:enchantable/crossbow", "#minecraft:enchantable/bow"],
    "#voxel:enchantable/shield": ["minecraft:shield"]
} as const;

export const VOXEL_TAGS = new Map(
    Object.entries(definitions).map(([id, values]) => [
        Identifier.of(id, "tags/item").toFilePath(),
        new TextEncoder().encode(JSON.stringify({ values }))
    ])
);
