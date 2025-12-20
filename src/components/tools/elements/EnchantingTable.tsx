import Block3D from "./Block3D";

interface BlockPosition {
    x: number;
    y: number;
    z: number;
    type?: "default" | "enchanting_table";
}

interface EnchantingTableProps {
    blockCount?: number;
}

export default function EnchantingTable({ blockCount = 0 }: EnchantingTableProps) {
    const enchantingTable: BlockPosition = { x: 2, z: 2, y: 0, type: "enchanting_table" };
    const positions: BlockPosition[] = [
        ...Array.from({ length: 3 }, (_, i) => ({ x: i + 1, z: 0, y: 0 })),
        ...Array.from({ length: 3 }, (_, i) => ({ x: 0, z: i + 1, y: 0 })),
        ...Array.from({ length: 3 }, (_, i) => ({ x: 4, z: i + 1, y: 0 })),
        ...Array.from({ length: 3 }, (_, i) => ({ x: i + 1, z: 0, y: 1 })),
        ...Array.from({ length: 2 }, (_, i) => ({ x: 4, z: i + 1, y: 1 })),
        ...Array.from({ length: 1 }, (_, i) => ({ x: 0, z: i + 1, y: 1 }))
    ].filter((pos, i, arr) => arr.findIndex((p) => p.x === pos.x && p.z === pos.z && p.y === pos.y) === i);

    const allBlocks = blockCount === 0 ? [enchantingTable] : [enchantingTable, ...positions.slice(0, blockCount)];

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(-45deg) rotateY(-45deg)",
                perspective: "2000px"
            }}>
            {allBlocks.map((block, index) => (
                <Block3D key={index.toString()} x={block.x} y={block.y} z={block.z} type={block.type} />
            ))}
        </div>
    );
}
