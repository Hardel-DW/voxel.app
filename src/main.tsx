import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { initI18n } from "@/lib/i18n";
import "./globals.css";

const router = createRouter({ routeTree, defaultPreload: "intent", defaultPreloadStaleTime: 10000, defaultPreloadDelay: 0 });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function Splash() {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6">
            <img src="/icons/logo.svg" alt="Voxel" className="size-24 animate-pulse" />
            <p className="text-zinc-500 text-sm tracking-widest uppercase">Loading...</p>
        </div>
    );
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<Splash />);

    initI18n().then(() => {
        root.render(<RouterProvider router={router} />);
    });
}
