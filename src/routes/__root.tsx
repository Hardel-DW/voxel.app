import { createRootRoute, Outlet } from "@tanstack/react-router";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import NotFound from "@/components/NotFound";
import Providers from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/Toast";
import { FloatingBarProvider } from "@/components/tools/floatingbar/FloatingBarContext";
import DebugPanel from "@/components/tools/debug/DebugPanel";
import AppLayout from "@/components/layout/AppLayout";

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
                    <DebugPanel />
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
