import LineSetup from "@/components/ui/line/LineSetup";

export default function SimpleLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen flex items-center overflow-hidden">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />

            <div className="fixed top-6 left-4 z-50 flex">
                <img src="/icons/logo.svg" alt="Voxel Logo" className="w-6 h-6 brightness-90 mx-2" />
                <div className="flex">
                    <span className="text-lg text-white font-bold">VOXEL</span>
                    <span className="text-s text-zinc-300 font-semibold">Labs</span>
                </div>
            </div>

            <LineSetup />

            <div className="-z-10 absolute inset-0 scale-110">
                <svg
                    className="size-full stroke-white/10 [stroke-dasharray:5_6] [stroke-dashoffset:10] stroke-2"
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

            {children}
        </div>
    );
}
