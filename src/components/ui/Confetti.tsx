import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    rotation: number;
    color: string;
    velocity: {
        x: number;
        y: number;
        rotation: number;
    };
}

const PARTICLE_COUNT = 150;

function getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

export function Confetti() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: canvas.width / 2,
            y: canvas.height / 2,
            rotation: Math.random() * Math.PI * 2,
            color: getRandomColor(),
            velocity: {
                x: (Math.random() - 0.5) * 15,
                y: Math.random() * -15 - 5,
                rotation: (Math.random() - 0.5) * 0.2
            }
        }));

        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > 3000) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const particle of particlesRef.current) {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.rotation += particle.velocity.rotation;
                particle.velocity.y += 0.2;

                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-5, -5, 10, 10);
                ctx.restore();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
