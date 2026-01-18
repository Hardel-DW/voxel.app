import LineSetup from "@/components/ui/line/LineSetup";

export default function NotFoundStudio() {
    return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden relative">
            <div className="z-10 absolute inset-0 scale-110">
                <svg
                    className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
                    style={{ transform: "skewY(-12deg)" }}>
                    <defs>
                        <pattern id="grid" viewBox="0 0 64 64" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
                            <path d="M64 0H0V64" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <LineSetup />

            <div className="relative z-10 px-8 py-12 w-full max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">This page is coming soon</h1>
                <p className="text-lg text-zinc-500 font-light leading-normal">
                    This page is currently under development. We are working hard to bring you this feature. Please check back later.
                </p>
            </div>
        </div>
    );
}
