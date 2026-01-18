interface Block3DProps {
    x?: number;
    y?: number;
    z?: number;
    type?: "default" | "enchanting_table";
    className?: string;
}

const BLOCK_TEXTURES = {
    default: {
        top: "/images/features/block/enchanting_table/oak_planks.png",
        bottom: "/images/features/block/enchanting_table/oak_planks.png",
        sides: "/images/features/block/enchanting_table/bookshelf.png"
    },
    enchanting_table: {
        top: "/images/features/block/enchanting_table/enchanting_table_top.png",
        bottom: "/images/features/block/enchanting_table/enchanting_table_bottom.png",
        sides: "/images/features/block/enchanting_table/enchanting_table_side.png"
    }
};

export default function Block3D({ x = 0, y = 0, z = 0, type = "default" }: Block3DProps) {
    const textures = BLOCK_TEXTURES[type];

    const faces = [
        { transform: "rotateY(0deg) translateZ(16px)", texture: textures.sides },
        { transform: "rotateY(90deg) translateZ(16px)", texture: textures.sides },
        { transform: "rotateY(180deg) translateZ(16px)", texture: textures.sides },
        { transform: "rotateY(-90deg) translateZ(16px)", texture: textures.sides },
        { transform: `rotateX(90deg) translateZ(${type === "enchanting_table" ? "8px" : "16px"})`, texture: textures.top },
        { transform: "rotateX(-90deg) translateZ(16px)", texture: textures.bottom }
    ];

    return (
        <div
            className="absolute w-8 h-8 transition-transform duration-150 starting:-translate-y-8 hidden:translate-y-8 transition-discrete"
            style={
                {
                    transformStyle: "preserve-3d",
                    "--x": `${x * 32}px`,
                    "--y": `${-y * 32}px`,
                    "--z": `${z * 32}px`,
                    transform: `translate3d(${x * 32 + 4}px, ${-y * 32 - 80}px, ${z * 32}px)`
                } as React.CSSProperties
            }>
            {faces.map((face, i) => (
                <div
                    key={i.toString()}
                    className="absolute w-8 h-8 bg-cover bg-no-repeat pixelated"
                    style={{
                        backgroundImage: `url(${face.texture})`,
                        transform: face.transform
                    }}
                />
            ))}
        </div>
    );
}
