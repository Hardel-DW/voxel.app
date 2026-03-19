import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { useLaunchStore } from "@/lib/store/LaunchStore";
import { routeTree } from "./routeTree.gen";
import "./globals.css";
import Splash from "./components/layout/Splash";

const router = createRouter({ routeTree, defaultPreload: "intent", defaultPreloadStaleTime: 10000, defaultPreloadDelay: 0 });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

useLaunchStore.getState().initialize();

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    //root.render(<Splash />);
    root.render(<RouterProvider router={router} />);
}
