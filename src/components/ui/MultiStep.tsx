import { Children, createContext, type ReactElement, type ReactNode, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const MultiStepContext = createContext<{
    currentStep: number;
    totalSteps: number;
    setStep: (step: number) => void;
    next: () => void;
    prev: () => void;
} | null>(null);

const isMultiStepItem = (child: ReactNode): child is ReactElement =>
    child !== null &&
    typeof child === "object" &&
    "type" in child &&
    (child.type as { displayName?: string })?.displayName === "MultiStepItem";

export function MultiStep({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState(0);
    const childrenArray = Children.toArray(children);
    const stepItems = childrenArray.filter(isMultiStepItem);
    const otherChildren = childrenArray.filter((child) => !isMultiStepItem(child));
    const totalSteps = stepItems.length;

    const value = {
        currentStep,
        totalSteps,
        setStep: setCurrentStep,
        next: () => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)),
        prev: () => setCurrentStep((s) => Math.max(s - 1, 0))
    };

    return (
        <MultiStepContext.Provider value={value}>
            <div key={currentStep}>{stepItems[currentStep]}</div>
            {otherChildren}
        </MultiStepContext.Provider>
    );
}

export function MultiStepItem({ children, ariaLabel }: { children: ReactNode; ariaLabel?: string }) {
    return (
        <div
            className="starting:opacity-50 transition-all duration-500 transition-discrete hidden:opacity-50"
            role="tabpanel"
            aria-label={ariaLabel}>
            {children}
        </div>
    );
}
MultiStepItem.displayName = "MultiStepItem";

export function MultiStepControl() {
    const ctx = useContext(MultiStepContext);
    if (!ctx) return null;

    const { currentStep, totalSteps, setStep, next, prev } = ctx;

    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 cursor-pointer hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex gap-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <button
                        key={i.toString()}
                        type="button"
                        onClick={() => setStep(i)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-200 cursor-pointer",
                            i === currentStep ? "bg-white w-6" : "bg-zinc-600 hover:bg-zinc-500"
                        )}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={next}
                disabled={currentStep === totalSteps - 1}
                className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 cursor-pointer hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
