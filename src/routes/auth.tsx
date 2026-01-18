import { createFileRoute, redirect } from "@tanstack/react-router";
import SimpleLayout from "@/components/layout/SimpleLayout";
import { handleGitHubCallback } from "@/lib/api/callback";

export const Route = createFileRoute("/auth")({
    beforeLoad: async ({ location }) => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (!code || !state) {
            throw new Error("Missing code or state parameter");
        }

        const result = await handleGitHubCallback(code, state);

        if (!result.isNewTab) {
            throw redirect({ to: result.returnTo });
        }

        if (typeof window !== "undefined") {
            const channel = new BroadcastChannel("github-auth");
            channel.postMessage({ type: "auth-success" });
            channel.close();
        }
    },
    component: AuthSuccess
});

function AuthSuccess() {
    return (
        <SimpleLayout>
            <div className="relative z-10 px-8 py-12 w-full max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold text-white">You are now authenticated with GitHub</h1>
                <p className="text-xl text-zinc-200 mt-4">You can close this tab to continue.</p>
            </div>
        </SimpleLayout>
    );
}
