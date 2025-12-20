import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { initI18n } from "@/lib/i18n";
import "./globals.css";
import Splash from "./components/layout/Splash";

const router = createRouter({ routeTree, defaultPreload: "intent", defaultPreloadStaleTime: 10000, defaultPreloadDelay: 0 });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<Splash />);
    // Promise.all([initI18n(), delay(2000)]).then(() => root.render(<RouterProvider router={router} />));
}
