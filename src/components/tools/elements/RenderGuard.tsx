import type React from "react";
import ErrorPlaceholder from "@/components/tools/elements/error/ErrorPlaceholder";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useElementCondition } from "@/lib/hook/useBreezeElement";
import type { Condition } from "@/lib/utils/lock";

interface RenderGuardProps {
    condition: Condition | undefined;
    children: React.ReactNode;
    elementId?: string;
}

export default function RenderGuard({ condition, children, elementId }: RenderGuardProps) {
    const shouldHide = useElementCondition(condition, elementId);
    if (shouldHide) return null;

    return <ErrorBoundary fallback={(error) => <ErrorPlaceholder error={error} />}>{children}</ErrorBoundary>;
}
