import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import Splash from "@/components/layout/Splash";
import { initI18n } from "@/lib/i18n";
import { initInstanceCache } from "@/lib/utils/instanceCache";
import { routeTree } from "./routeTree.gen";
import "./globals.css";

const router = createRouter({ routeTree, defaultPreload: "intent", defaultPreloadStaleTime: 10000, defaultPreloadDelay: 0 });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    const showSplash = !sessionStorage.getItem("voxel-splash");
    if (showSplash) {
        sessionStorage.setItem("voxel-splash", "1");
        root.render(<Splash />);
    }

    const tasks: Promise<unknown>[] = [initI18n(), initInstanceCache()];
    if (showSplash) tasks.push(new Promise((r) => setTimeout(r, 2000)));
    Promise.all(tasks).then(() => root.render(<RouterProvider router={router} />));
}