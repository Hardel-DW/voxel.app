import { startTransition, useRef, useState } from "react";
import Portal from "@/components/ui/Portal";

interface WalkthroughStep {
    title: string;
    description: string;
    target?: string; // CSS selector (e.g., "#my-id", ".my-class")
    position?: "top" | "bottom" | "left" | "right";
    image?: string;
    imagePosition?: "top-right" | "top" | "top-left" | "right" | "middle" | "left" | "bottom-right" | "bottom" | "bottom-left";
}

function StepIndicator({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={`step-indicator-${index.toString()}`}
                    className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-white" : "bg-white/30"}`}
                />
            ))}
        </div>
    );
}

export default function Walkthrough({ steps }: { steps: WalkthroughStep[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Refs
    const highlightRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    function open() {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
        setCurrentStep(0);
    }

    function close() {
        setIsOpen(false);
        document.body.style.overflow = "";
    }

    function next() {
        if (currentStep >= steps.length - 1) {
            close();
        } else {
            startTransition(() => {
                setCurrentStep((prev) => prev + 1);
            });
        }
    }

    function prev() {
        if (currentStep > 0) {
            startTransition(() => {
                setCurrentStep((prev) => prev - 1);
            });
        }
    }

    // Récupérer la position de l'image
    function getImagePosition(rect: DOMRect, position?: string) {
        const margin = 20;
        const imageWidth = 300;
        const imageHeight = 200;

        const positions: Record<string, { top: number; left: number }> = {
            "top-right": {
                top: rect.top - imageHeight - margin,
                left: rect.right - imageWidth
            },
            top: {
                top: rect.top - imageHeight - margin,
                left: rect.left + (rect.width - imageWidth) / 2
            },
            "top-left": {
                top: rect.top - imageHeight - margin,
                left: rect.left
            },
            right: {
                top: rect.top + (rect.height - imageHeight) / 2,
                left: rect.right + margin
            },
            middle: {
                top: rect.top + (rect.height - imageHeight) / 2,
                left: rect.left + (rect.width - imageWidth) / 2
            },
            left: {
                top: rect.top + (rect.height - imageHeight) / 2,
                left: rect.left - imageWidth - margin
            },
            "bottom-right": {
                top: rect.bottom + margin,
                left: rect.right - imageWidth
            },
            bottom: {
                top: rect.bottom + margin,
                left: rect.left + (rect.width - imageWidth) / 2
            },
            "bottom-left": {
                top: rect.bottom + margin,
                left: rect.left
            }
        };

        return positions[position || "right"] || positions.right;
    }

    // Mettre à jour les positions des éléments
    function updateElementPositions(rect: DOMRect, step: WalkthroughStep) {
        if (!highlightRef.current) return;

        highlightRef.current.style.display = "block";
        highlightRef.current.style.top = `${rect.top - 8}px`;
        highlightRef.current.style.left = `${rect.left - 8}px`;
        highlightRef.current.style.width = `${rect.width + 16}px`;
        highlightRef.current.style.height = `${rect.height + 16}px`;

        if (step.image && imageRef.current) {
            const imgPosition = getImagePosition(rect, step.imagePosition);
            imageRef.current.style.display = "block";
            imageRef.current.style.top = `${imgPosition.top}px`;
            imageRef.current.style.left = `${imgPosition.left}px`;
        } else if (imageRef.current) {
            imageRef.current.style.display = "none";
        }
    }

    if (isOpen) {
        const step = steps[currentStep];

        if (step.target && typeof step.target === "string") {
            queueMicrotask(() => {
                const targetElement = document.querySelector(step.target as string);
                if (!targetElement || !highlightRef.current) return;

                const rect = targetElement.getBoundingClientRect();
                const isInViewport =
                    rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

                // Si l'élément n'est pas visible, on scrolle jusqu'à lui
                if (!isInViewport) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    window.requestAnimationFrame(() => {
                        const updatedRect = targetElement.getBoundingClientRect();
                        updateElementPositions(updatedRect, step);
                    });
                } else {
                    updateElementPositions(rect, step);
                }
            });
        } else if (highlightRef.current) {
            highlightRef.current.style.display = "none";
            if (imageRef.current) imageRef.current.style.display = "none";
        }
    }

    // Toujours afficher le bouton trigger
    return (
        <>
            <button
                type="button"
                className="fixed bottom-4 right-4 p-3 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 hover:bg-zinc-800/80 transition-colors z-40"
                onClick={open}
                aria-label="Ouvrir le guide interactif">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </button>

            {isOpen && (
                <Portal>
                    <div className="fixed inset-0 z-50">
                        {/* Overlay de fond */}
                        <div className="absolute inset-0 bg-black/50" />

                        {/* Highlight de l'élément cible */}
                        <div
                            ref={highlightRef}
                            className="absolute border-2 border-white/50 rounded-lg transition-all duration-300"
                            style={{ display: "none" }}
                        />

                        {/* Container de l'image */}
                        <div ref={imageRef} className="absolute transition-all duration-300" style={{ display: "none" }}>
                            {steps[currentStep].image && (
                                <img
                                    src={steps[currentStep].image}
                                    alt={steps[currentStep].title}
                                    className="rounded-lg shadow-xl max-w-md"
                                />
                            )}
                        </div>

                        {/* Contenu du walkthrough */}
                        <div
                            ref={contentRef}
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl mb-8 p-6 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 transition-all duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
                            <p className="text-zinc-300 mb-6">{steps[currentStep].description}</p>

                            <div className="flex items-center justify-between">
                                <button
                                    className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                    onClick={prev}
                                    disabled={currentStep === 0}
                                    type="button">
                                    Précédent
                                </button>

                                <StepIndicator current={currentStep} total={steps.length} />

                                <button
                                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                    onClick={next}
                                    type="button">
                                    {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}
