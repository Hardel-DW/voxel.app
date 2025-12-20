import { useSearch } from "@tanstack/react-router";
import type React from "react";
import { Children, cloneElement, createContext, isValidElement, type ReactNode, useContext, useState } from "react";
import OriginalToolRevealCard from "@/components/tools/elements/ToolRevealElementType";
import { cn } from "@/lib/utils";

export type ToolRevealCardData = {
    id: string;
    title: string;
    soon?: string;
    image: string;
    logo: string;
    href: string;
    description: string;
};

type ToolRevealContextType = {
    activeId: string;
    setActiveId: (id: string) => void;
};

const ToolRevealContext = createContext<ToolRevealContextType | undefined>(undefined);

const useToolReveal = () => {
    const context = useContext(ToolRevealContext);
    if (!context) {
        throw new Error("useToolReveal must be used within a ToolReveal component");
    }
    return context;
};

export type ToolRevealElementProps = ToolRevealCardData & {
    children: ReactNode;
    className?: string;
};

export function ToolRevealElement(props: ToolRevealElementProps) {
    const { activeId, setActiveId } = useToolReveal();
    const { id, title, soon, image, logo, href, description } = props;

    const isSelected = activeId === id;
    const cardDataForRenderer: ToolRevealCardData = { id, title, soon, image, logo, href, description };

    return <OriginalToolRevealCard element={cardDataForRenderer} isSelected={isSelected} onSelect={() => setActiveId(id)} />;
}

type ToolRevealProps = {
    children: ReactNode;
    defaultValue: string;
    className?: string;
    listClassName?: string;
    contentClassName?: string;
    searchParam?: string;
    useUrlSync?: boolean;
};

export default function ToolReveal({
    children,
    defaultValue,
    className,
    listClassName,
    contentClassName,
    searchParam,
    useUrlSync = false
}: ToolRevealProps) {
    const search = useSearch({ from: "/editor" }) as Record<string, string | undefined>;

    const urlValue = searchParam && useUrlSync ? search[searchParam] : null;
    const [localActiveId, setLocalActiveId] = useState<string>(defaultValue);
    const activeId = urlValue || localActiveId;
    const triggers: React.ReactElement<ToolRevealElementProps>[] = [];
    let activeContent: ReactNode | null = null;

    Children.forEach(children, (child) => {
        if (isValidElement(child) && child.type === ToolRevealElement) {
            const toolRevealElement = child as React.ReactElement<ToolRevealElementProps>;
            triggers.push(toolRevealElement);
            if (toolRevealElement.props.id === activeId) {
                activeContent = toolRevealElement.props.children;
            }
        }
    });

    return (
        <ToolRevealContext.Provider value={{ activeId, setActiveId: setLocalActiveId }}>
            <div className={cn("grid gap-4", className)}>
                <div
                    className={cn("grid max-xl:grid-cols-1 gap-4", listClassName)}
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(225px, 1fr))" }}>
                    {triggers.map((triggerElement) => cloneElement(triggerElement, { key: triggerElement.props.id }))}
                </div>

                <div className="h-1 my-4 rounded-full w-full bg-zinc-900" />

                {activeContent && <div className={cn(contentClassName)}>{activeContent}</div>}
            </div>
        </ToolRevealContext.Provider>
    );
}
