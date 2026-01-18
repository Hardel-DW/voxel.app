import { createRootRoute, Outlet } from "@tanstack/react-router";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import AppLayout from "@/components/layout/AppLayout";
import NotFound from "@/components/NotFound";
import Providers from "@/components/QueryProvider";
import { FloatingBarProvider } from "@/components/tools/floatingbar/FloatingBarContext";
import { Toaster } from "@/components/ui/Toast";

export const Route = createRootRoute({
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    component: RootComponent
});

function RootComponent() {
    return (
        <div className="antialiased">
            <div className="flex relative h-dvh">
                <Providers>
                    <FloatingBarProvider>
                        <AppLayout>
                            <Outlet />
                        </AppLayout>
                    </FloatingBarProvider>
                    <Toaster />
                </Providers>
            </div>
        </div>
    );
}
