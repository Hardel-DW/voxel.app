import LineBackground from "@/components/ui/line/LineBackground";

export default function Background() {
    return (
        <div className="z-10 absolute inset-0 scale-110">
            <div className="fixed -z-50 -top-32 -right-32 size-96 rounded-full blur-3xl bg-linear-to-br from-white/5 to-teal-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-amber-900/20 to-teal-900/20" />

            {/* Noise overlay - fixes Firefox gradient banding */}
            <svg className="fixed inset-0 size-full pointer-events-none opacity-[0.03] -z-40">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
            <div className="absolute inset-0 size-full -z-10">
                <LineBackground />
            </div>

            <svg
                className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2 select-none pointer-events-none"
                style={{ transform: "skewY(-12deg)" }}>
                <title>Grid</title>
                <defs>
                    <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                        <path d="M64 0H0V64" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
}