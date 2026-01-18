import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { buildChangesTree, getConceptFolderIcons } from "@/components/tools/concept/changes/buildChangesTree";
import { ChangesFileTree } from "@/components/tools/concept/changes/ChangesFileTree";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { TOAST, toast } from "@/components/ui/Toast";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { FileTree } from "@/components/ui/tree/FileTree";
import { TreeProvider } from "@/components/ui/tree/TreeNavigationContext";
import { GitHub } from "@/lib/github/GitHub";
import { useTranslate } from "@/lib/i18n";
import { useChangesStore } from "@/lib/store/ChangesStore";
import { useGithubStore } from "@/lib/store/GithubStore";
import { encodeToBase64 } from "@/lib/utils/encode";

const overviewRoute = "/$lang/studio/editor/changes/main";
const detailRoute = "/$lang/studio/editor/changes/diff";
const changesRoute = "/$lang/studio/editor/changes/main";
export const Route = createFileRoute("/$lang/studio/editor/changes")({
    component: ChangesLayout,
    beforeLoad: () => useChangesStore.getState().compile()
});

function ChangesLayout() {
    const t = useTranslate();
    const navigate = useNavigate();
    const { lang } = Route.useParams();
    const search = useRouterState({ select: (s) => s.location.search as { file?: string } });
    const selectedFile = search.file;
    const { isGitRepository, owner, repositoryName, branch, token } = useGithubStore();
    const { compiledFiles, diff } = useChangesStore();
    const [message, setMessage] = useState("");
    const [viewMode, setViewMode] = useState<"file" | "concept">("concept");
    const tree = buildChangesTree(diff);
    const folderIcons = getConceptFolderIcons();
    const onSelectElement = (filePath: string) => {
        navigate({ to: detailRoute, params: { lang }, search: { file: filePath } });
    };
    const onSelectFolder = () => {};

    const pushMutation = useMutation({
        mutationFn: () => {
            const filesToPush = Object.fromEntries(
                Array.from(diff).map(([path, status]) => [path, status === "deleted" ? null : encodeToBase64(compiledFiles[path])])
            );
            return new GitHub({ token }).send(owner, repositoryName, branch, "push", filesToPush);
        },
        onSuccess: () => {
            toast(t("github:push.success"), TOAST.SUCCESS);
            setMessage("");
        },
        onError: (error: Error) => {
            toast(t("github:push.error"), TOAST.ERROR, error.message);
        }
    });

    return (
        <TreeProvider
            config={{
                concept: "changes",
                overviewRoute,
                detailRoute,
                changesRoute,
                tree,
                folderIcons,
                selectedElementId: selectedFile,
                onSelectElement,
                onSelectFolder
            }}>
            <div className="flex size-full overflow-hidden relative isolate bg-sidebar">
                <aside className="w-72 shrink-0 border-r border-zinc-800/50 bg-zinc-950/75 flex flex-col">
                    <div className="px-6 pt-6">
                        <div className="text-lg font-bold text-zinc-100 flex items-center gap-2 mb-1">
                            <img src="/icons/pencil.svg" className="size-5 invert opacity-80" alt="Changes icon" />
                            <span>{t("changes:layout.title")}</span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-7">{t("changes:layout.subtitle", { count: diff.size })}</p>
                    </div>

                    {isGitRepository && (
                        <div className="px-3 mt-4 space-y-2">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-500">
                                <img src="/icons/company/github.svg" className="size-3.5 invert opacity-50" alt="GitHub" />
                                <span className="font-mono truncate">
                                    {owner}/{repositoryName}
                                </span>
                            </div>
                            <TextInput
                                className="rounded-lg"
                                disableIcon
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t("github:layout.commit.placeholder")}
                            />
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={() => pushMutation.mutate()}
                                disabled={pushMutation.isPending || diff.size === 0 || !message.trim()}>
                                {pushMutation.isPending ? t("github:layout.commit.button.pushing") : t("github:layout.commit.button.push")}
                            </Button>
                        </div>
                    )}

                    <div className="px-3 mt-4">
                        <ToggleGroup value={viewMode} onChange={(v) => setViewMode(v as "file" | "concept")}>
                            <ToggleGroupOption value="concept">{t("changes:view.concept")}</ToggleGroupOption>
                            <ToggleGroupOption value="file">{t("changes:view.file")}</ToggleGroupOption>
                        </ToggleGroup>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 mt-2">
                        {viewMode === "file" ? (
                            <ChangesFileTree diff={diff} allFiles={compiledFiles} selectedFile={selectedFile} />
                        ) : (
                            <FileTree />
                        )}
                    </div>

                    <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/90">
                        {!isGitRepository && (
                            <Link to="/$lang/studio/editor/github" params={{ lang }} className="block">
                                <Button variant="ghost" className="w-full gap-2 border border-zinc-800">
                                    <img src="/icons/company/github.svg" className="size-4 invert opacity-60" alt="GitHub" />
                                    {t("changes:layout.init_github")}
                                </Button>
                            </Link>
                        )}
                    </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col bg-zinc-950">
                    <Outlet />
                </main>
            </div>
        </TreeProvider>
    );
}
