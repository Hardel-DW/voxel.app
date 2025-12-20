import { useMutation } from "@tanstack/react-query";
import type { FileStatus } from "@voxelio/breeze";
import { DatapackDownloader } from "@voxelio/breeze";
import { useState } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { TextInput } from "@/components/ui/TextInput";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";
import { GitHub } from "@/lib/github/GitHub";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { cn } from "@/lib/utils";
import { encodeToBase64 } from "@/lib/utils/encode";

type GitHubActionPayload = {
    type: "push" | "pr";
    changes: Map<string, FileStatus>;
    files: Record<string, string | null>;
};

export default function GithubSender() {
    const [pendingAction, setPendingAction] = useState<GitHubActionPayload | null>(null);
    const { owner, repositoryName, branch, token, isGitRepository } = useExportStore();
    const { isAuthenticated } = useGitHubAuth();
    const [newBranch, setNewBranch] = useState<string | undefined>(undefined);

    const { mutate, isPending } = useMutation({
        mutationFn: () => new GitHub({ token }).send(owner, repositoryName, branch, pendingAction?.type, pendingAction?.files, newBranch),
        onSuccess: (data) => {
            const message = pendingAction?.type === "pr" ? t("github.pr.success") : t("github.push.success");
            const detail =
                pendingAction?.type === "pr" ? data.prUrl || undefined : t("github.files.modified").replace("%s", String(data.filesModified));
            toast(message, TOAST.SUCCESS, detail);
            setPendingAction(null);
            setNewBranch(undefined);
        },
        onError: (error: Error) => {
            const message = pendingAction?.type === "pr" ? t("github.pr.error") : t("github.push.error");
            toast(message, TOAST.ERROR, error.message);
        }
    });

    const handleGitAction = (type: GitHubActionPayload["type"]) => {
        const configuratorStore = useConfiguratorStore.getState();
        const compiledFiles = configuratorStore.compile().getFiles();
        const changes = new DatapackDownloader(compiledFiles).getDiff(configuratorStore.files);
        if (changes.size === 0) {
            toast(t("github.no.changes"), TOAST.ERROR);
            return false;
        }

        const files = Object.fromEntries(
            Array.from(changes).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
        );

        setPendingAction({ type, changes, files });
        return true;
    };

    if (!isGitRepository) return null;

    return (
        <Dialog id="confirm-github-modal" className="flex flex-col gap-1">
            <DialogTrigger disabled={!isAuthenticated} onBeforeOpen={() => handleGitAction("pr")}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    {t("export.pull")}
                    <img src="/icons/company/pull.svg" alt="pull" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogTrigger disabled={!isAuthenticated} onBeforeOpen={() => handleGitAction("push")}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    {t("export.push")}
                    <img src="/icons/company/github.svg" alt="push" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-4">
                            <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                            <span className="text-xl font-medium text-zinc-200">
                                {t(pendingAction?.type === "pr" ? "github.dialog.pr.title" : "github.dialog.push.title")}
                            </span>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        {t(pendingAction?.type === "pr" ? "github.dialog.pr.description" : "github.dialog.push.description")}
                    </DialogDescription>
                </DialogHeader>

                {pendingAction && (
                    <div>
                        <div className="text-sm text-zinc-300 mb-3">
                            {t("github.files.count")} {pendingAction.changes.size}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950">
                            {Array.from(pendingAction.changes).map(([path, status]) => (
                                <div
                                    key={path}
                                    className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 last:border-b-0 hover:bg-zinc-900/50 transition">
                                    <span
                                        className={cn(
                                            "text-xs font-mono px-2 py-1 rounded",
                                            status === "added" && "bg-green-900/30 text-green-400",
                                            status === "updated" && "bg-yellow-900/30 text-yellow-400",
                                            status === "deleted" && "bg-red-900/30 text-red-400"
                                        )}>
                                        {status === "added" ? "+" : status === "updated" ? "~" : "-"}
                                    </span>
                                    <span className="text-sm text-zinc-300 font-mono truncate flex-1">{path}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {pendingAction?.type === "pr" && (
                            <TextInput
                                disableIcon
                                placeholder="Branch Name"
                                value={newBranch}
                                onChange={(e) => setNewBranch(e.target.value || undefined)}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <DialogCloseButton variant="link" disabled={isPending}>
                            {t("github.dialog.cancel")}
                        </DialogCloseButton>
                        <DialogCloseButton type="button" onClick={() => pendingAction && mutate()} variant="ghost" disabled={isPending}>
                            {t(isPending ? "github.dialog.processing" : pendingAction?.type === "pr" ? "github.dialog.pr.confirm" : "github.dialog.push.confirm")}
                        </DialogCloseButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
