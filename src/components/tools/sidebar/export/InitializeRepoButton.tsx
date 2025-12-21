import { useMutation } from "@tanstack/react-query";
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
import { GitHub } from "@/lib/github/GitHub";
import { GithubRepoValidationError } from "@/lib/github/GitHubError";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { t } from "@/lib/i18n";
import { encodeToBase64 } from "@/lib/utils/encode";
import { sanitizeRepoName } from "@/lib/utils/text";

const DESCRIPTION = "Minecraft datapack created with Voxel Studio";

export default function InitializeRepoButton() {
    const [repoName, setRepoName] = useState("");
    const { token } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const { isAuthenticated } = useGitHubAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const compiledFiles = useConfiguratorStore.getState().compile().getFiles();
            const files = Object.fromEntries(Object.entries(compiledFiles).map(([path, content]) => [path, encodeToBase64(content)]));
            useExportStore.getState().setInitializing(Object.keys(files).length);
            toast(
                t("github.init.progress"),
                TOAST.INFO,
                t("github.init.progress.count").replace("%s", Object.keys(files).length.toString())
            );
            return new GitHub({ token }).initializeRepository(repoName, DESCRIPTION, false, true, files);
        },
        onSuccess: (data) => {
            toast(t("github.init.success"), TOAST.SUCCESS, data.htmlUrl);
            const [owner, repositoryName] = data.fullName.split("/");
            useExportStore.setState({ owner, repositoryName, branch: data.defaultBranch, isGitRepository: true });
            setRepoName("");
        },
        onError: (error: Error) => {
            if (error instanceof GithubRepoValidationError) {
                return toast(t("github.init.error.validation"), TOAST.ERROR, t("github.init.error.validation.desc"));
            }
            toast(t("github.init.error"), TOAST.ERROR, error.message);
        },
        onSettled: () => useExportStore.getState().setInitializing(null)
    });

    const handleSubmit = () => {
        const trimmedName = repoName.trim();
        if (!trimmedName) {
            return toast(t("github.init.error.empty"), TOAST.ERROR);
        }

        const isValid = /^[a-zA-Z0-9_-]+$/.test(trimmedName);
        if (!isValid) {
            return toast(t("github.init.error.invalid"), TOAST.ERROR);
        }

        mutate();
    };

    return (
        <Dialog id="init-repo-modal" onOpenChange={(open) => open && setRepoName(name.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}>
            <DialogTrigger disabled={!isAuthenticated}>
                <Button type="button" variant="aurora" disabled={!isAuthenticated}>
                    {t("export.init_repository")}
                    <img src="/icons/company/github.svg" alt="init" className="size-4 invert-75" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-4">
                            <img src="/icons/company/github.svg" alt="GitHub" className="size-6 invert" />
                            <span className="text-xl font-medium text-zinc-200">{t("github.init.title")}</span>
                        </div>
                    </DialogTitle>
                    <DialogDescription>{t("github.init.description")}</DialogDescription>
                </DialogHeader>

                <div>
                    <label htmlFor="repo-name" className="text-sm text-zinc-300 mb-2 block">
                        {t("github.init.label")}
                    </label>
                    <TextInput
                        disableIcon={true}
                        id="repo-name"
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(sanitizeRepoName(e.target.value))}
                        placeholder={t("github.init.placeholder")}
                        disabled={isPending}
                        className="w-full"
                    />
                </div>

                <DialogFooter className="pt-6 flex items-center justify-end gap-3">
                    <DialogCloseButton variant="ghost" disabled={isPending}>
                        {t("github.dialog.cancel")}
                    </DialogCloseButton>
                    <DialogCloseButton type="button" onClick={handleSubmit} variant="default" disabled={isPending}>
                        {isPending ? t("github.dialog.processing") : t("github.init.confirm")}
                    </DialogCloseButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
