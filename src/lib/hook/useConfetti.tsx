import { useState } from "react";
import { Confetti } from "@/components/ui/Confetti";

export function useConfetti() {
    const [confettiIds, setConfettiIds] = useState<number[]>([]);

    const addConfetti = () => {
        const newId = Date.now();
        setConfettiIds((ids) => [...ids, newId]);
        setTimeout(() => setConfettiIds((ids) => ids.filter((id) => id !== newId)), 3000);
    };

    const renderConfetti = (): React.ReactNode => confettiIds.map((id) => <Confetti key={id} />);

    return { addConfetti, renderConfetti };
}
