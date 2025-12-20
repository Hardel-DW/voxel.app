import { createContext, type ReactNode, useContext, useState } from "react";

export interface TabsState {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

export function createTabsContext() {
    const Context = createContext<TabsState | null>(null);

    function Provider({ children, defaultValue }: { children: ReactNode; defaultValue: string }) {
        const [activeTab, setActiveTab] = useState(defaultValue);

        return <Context.Provider value={{ activeTab, setActiveTab }}>{children}</Context.Provider>;
    }

    function useTabs() {
        const context = useContext(Context);
        if (!context) {
            throw new Error("useTabs must be used within a TabsProvider");
        }
        return context;
    }

    return {
        Provider,
        useTabs
    };
}
