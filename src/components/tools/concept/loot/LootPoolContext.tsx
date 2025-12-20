import { createContext, use } from "react";

interface LootPoolContextValue {
    onAddItem: (poolIndex: number) => void;
    onEditItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
    onWeightChange: (id: string, weight: number) => void;
    onBalanceWeights: (poolIndex: number) => void;
    onNavigate: (name: string) => void;
}

export const LootPoolContext = createContext<LootPoolContextValue | null>(null);

export function useLootPoolActions(): LootPoolContextValue {
    const context = use(LootPoolContext);
    if (!context) {
        throw new Error("useLootPoolActions must be used within a LootPoolContext.Provider");
    }
    return context;
}
