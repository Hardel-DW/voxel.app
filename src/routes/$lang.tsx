import { createFileRoute, Outlet } from "@tanstack/react-router";
import NotFound from "@/components/NotFound";
import { type Locale, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$lang")({
    beforeLoad: async ({ params, cause }) => {
        if (cause !== "preload") {
            await useI18n.getState().setLocale(params.lang as Locale);
        }
    },
    component: LangLayout,
    notFoundComponent: NotFound
});

function LangLayout() {
    return (
        <div className="antialiased">
            <Outlet />
        </div>
    );
}
