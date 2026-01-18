import { createRootRoute, Outlet } from "@tanstack/react-router";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import NotFound from "@/components/NotFound";
import Providers from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/Toast";

export const Route = createRootRoute({
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    component: RootComponent
});

function RootComponent() {
    return (
        <Providers>
            <Outlet />
            <Toaster />
        </Providers>
    );
}
