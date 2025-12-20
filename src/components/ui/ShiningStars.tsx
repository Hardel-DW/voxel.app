import { useLayoutEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    baseOpacity: number;
    size: number;
    speed: number;
    isDot: boolean;
    phase: number;
}

export default function ShiningStars() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number>(0);
    const starsRef = useRef<Star[]>([]);
    const previousWidthRef = useRef<number>(0);
    const initialSeedRef = useRef<number>(Date.now());
    const seededRandomRef = useRef<() => number>(() => 0);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const createSeededRandom = (seed: number) => {
            let state = seed;
            return () => {
                state = (state * 1664525 + 1013904223) % 4294967296;
                return state / 4294967296;
            };
        };

        const createStar = (): Star => ({
            x: seededRandomRef.current() * canvas.width,
            y: seededRandomRef.current() * canvas.height,
            baseOpacity: seededRandomRef.current() * 0.5 + 0.5,
            size: 0.2 + seededRandomRef.current() * 1.4,
            speed: 0.001 + seededRandomRef.current() * 0.005,
            isDot: seededRandomRef.current() < 0.8,
            phase: seededRandomRef.current() * Math.PI * 2
        });

        const drawStar = (star: Star, time: number) => {
            ctx.save();
            ctx.globalAlpha = star.baseOpacity + Math.sin(time * star.speed + star.phase) * 0.5;
            ctx.translate(star.x, star.y);
            ctx.fillStyle = "#FFFFFF86";
            ctx.strokeStyle = "#FFFFFF86";

            if (star.isDot) {
                ctx.beginPath();
                ctx.arc(0, 0, star.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                const length = star.size * 5;
                const innerLength = length / 3;
                const tipRadius = innerLength / 2;
                ctx.beginPath();
                ctx.moveTo(0, -length);
                ctx.arcTo(tipRadius, -length + tipRadius, innerLength, -innerLength, tipRadius);
                ctx.lineTo(innerLength, -innerLength);
                ctx.arcTo(length - tipRadius, -tipRadius, length, 0, tipRadius);
                ctx.lineTo(length, 0);
                ctx.arcTo(length - tipRadius, tipRadius, innerLength, innerLength, tipRadius);
                ctx.lineTo(innerLength, innerLength);
                ctx.arcTo(tipRadius, length - tipRadius, 0, length, tipRadius);
                ctx.lineTo(0, length);
                ctx.arcTo(-tipRadius, length - tipRadius, -innerLength, innerLength, tipRadius);
                ctx.lineTo(-innerLength, innerLength);
                ctx.arcTo(-length + tipRadius, tipRadius, -length, 0, tipRadius);
                ctx.lineTo(-length, 0);
                ctx.arcTo(-length + tipRadius, -tipRadius, -innerLength, -innerLength, tipRadius);
                ctx.lineTo(-innerLength, -innerLength);
                ctx.arcTo(-tipRadius, -length + tipRadius, 0, -length, tipRadius);
                ctx.lineTo(0, -length);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        };

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const star of starsRef.current) drawStar(star, time);
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            const newWidth = window.innerWidth;
            canvas.width = newWidth;
            canvas.height = window.innerHeight;
            if (newWidth !== previousWidthRef.current) {
                seededRandomRef.current = createSeededRandom(initialSeedRef.current);
                starsRef.current = Array.from({ length: 100 }, createStar);
                previousWidthRef.current = newWidth;
            }
        };

        const handleResize = () => {
            resizeCanvas();
            cancelAnimationFrame(animationFrameIdRef.current);
            animate(0);
        };

        seededRandomRef.current = createSeededRandom(initialSeedRef.current);
        resizeCanvas();
        animate(0);
        window.addEventListener("resize", handleResize);
        const observer = new ResizeObserver(handleResize);
        observer.observe(canvas);

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="size-full opacity-50 md:opacity-100" />;
}
