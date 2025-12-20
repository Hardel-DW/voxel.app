import type React from "react";
import RenderGuard from "@/components/tools/elements/RenderGuard";
import type { BaseComponent } from "@/lib/hook/useBreezeElement";
import { cn } from "@/lib/utils";

export type ToolGridType = BaseComponent & {
    size?: string;
    children: React.ReactNode;
    className?: string;
};

export default function ToolGrid(props: ToolGridType) {
    return (
        <RenderGuard condition={props.hide}>
            <div
                className={cn("grid max-xl:grid-cols-1 gap-4", props.className)}
                style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${props.size ?? "255px"}, 1fr))`
                }}>
                {props.children}
            </div>
        </RenderGuard>
    );
}
