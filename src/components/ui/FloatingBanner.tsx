import { cn } from "@/lib/utils";

interface FloatingBannerProps {
    icon: string;
    hue: number;
    className?: string;
    children: React.ReactNode;
}

export function FloatingBanner({ icon, hue, className, children }: FloatingBannerProps) {
    const accentColor = `hsl(${hue}, 70%, 60%)`;
    const glowColor = `hsl(${hue}, 70%, 50%, 0.2)`;

    return (
        <div className={cn("absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-1", className)}>
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all">
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-5">
                    <div className="shrink-0 relative">
                        <div className="absolute inset-0 blur-xl rounded-full" style={{ backgroundColor: glowColor }} />
                        <div className="relative p-2.5 bg-zinc-900/50 border border-white/10 rounded-xl" style={{ color: accentColor }}>
                            <img
                                src={icon}
                                alt=""
                                className="size-6"
                                style={{ filter: `sepia(1) saturate(5) hue-rotate(${hue - 50}deg)` }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">{children}</div>
                </div>
            </div>
        </div>
    );
}
