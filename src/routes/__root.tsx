import { createRootRoute, Outlet } from "@tanstack/react-router";
import DefaultCatchBoundary from "@/components/DefaultCatchBoundary";
import NotFound from "@/components/NotFound";
import Providers from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/Toast";
import { useLocalStorage } from "@/lib/hook/useLocalStorage";
import ShiningStars from "@/components/ui/ShiningStars";
import { FloatingBarProvider } from "@/components/tools/floatingbar/FloatingBarContext";
import DebugPanel from "@/components/tools/debug/DebugPanel";

export const Route = createRootRoute({
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    component: RootComponent
});

function RootComponent() {
    const [disableEffects] = useLocalStorage("studio:disable-effects", false);

    return (
        <div className="antialiased">
            <div className="flex relative h-dvh">
                <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
                <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
                <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
                <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />

                {disableEffects && (
                    <div className="fixed inset-0 -z-10">
                        <ShiningStars />
                    </div>
                )}

                <Providers>
                    <DebugPanel />
                    <FloatingBarProvider>
                        <Outlet />
                    </FloatingBarProvider>
                    <Toaster />
                </Providers>
            </div>
        </div>
    );
}
