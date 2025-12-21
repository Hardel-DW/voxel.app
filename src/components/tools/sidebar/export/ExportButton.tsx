import type { RefObject } from "react";
import { useConfiguratorStore } from "@/components/tools/Store";
import { useExportStore } from "@/components/tools/sidebar/ExportStore";
import AuthView from "@/components/tools/sidebar/export/AuthView";
import DownloadButton from "@/components/tools/sidebar/export/DownloadButton";
import GithubSender from "@/components/tools/sidebar/export/GithubSender";
import InitializeRepoButton from "@/components/tools/sidebar/export/InitializeRepoButton";
import RepositoryLoading from "@/components/tools/sidebar/export/RepositoryLoading";
import UnauthView from "@/components/tools/sidebar/export/UnauthView";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { ToggleGroup, ToggleGroupOption } from "@/components/ui/ToggleGroup";
import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";
import { t } from "@/lib/i18n";

export default function ExportButton({ containerRef }: { containerRef?: RefObject<HTMLDivElement | null> }) {
    const { owner, repositoryName, isGitRepository } = useExportStore();
    const name = useConfiguratorStore((state) => state.name);
    const isModded = useConfiguratorStore((state) => state.isModded);
    const setIsModded = useConfiguratorStore((state) => state.setIsModded);
    const { isAuthenticated } = useGitHubAuth();

    return (
        <Popover className="in-data-pinned:w-full">
            <PopoverTrigger className="size-10 in-data-pinned:w-full in-data-pinned:flex-1">
                <Button
                    type="button"
                    className="size-full p-0 in-data-pinned:w-full in-data-pinned:items-center in-data-pinned:gap-2"
                    variant="shimmer"
                    size="default">
                    <img src="/icons/upload.svg" alt="Export" className="size-5 block in-data-pinned:hidden" />
                    <span className="text-sm hidden in-data-pinned:block whitespace-nowrap">{t("export")}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                containerRef={containerRef}
                spacing={20}
                className="rounded-none border-none shadow-none p-0 bg-transparent space-y-2">
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 p-4">
                    <div className="relative">{isAuthenticated ? <AuthView /> : <UnauthView />}</div>
                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                    </div>
                </div>
                <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-200 shadow-md z-20 flex flex-col p-2 pb-3 gap-3">
                    <ToggleGroup value={isModded ? "jar" : "zip"} onChange={(v) => setIsModded(v === "jar")}>
                        <ToggleGroupOption className="h-10" value="zip">
                            <div className="flex gap-2 items-center justify-center">
                                <span className="text-zinc-300">Datapack</span>
                                <span className="text-zinc-500">(.zip)</span>
                            </div>
                        </ToggleGroupOption>
                        <ToggleGroupOption className="h-10" value="jar">
                            <div className="flex gap-2 items-center justify-center">
                                <span className="text-zinc-300">Mod</span>
                                <span className="text-zinc-500">(.jar)</span>
                            </div>
                        </ToggleGroupOption>
                    </ToggleGroup>
                    <RepositoryLoading />
                    <div className="flex flex-col gap-1 bg-neutral-950 rounded-2xl p-2 border border-zinc-800">
                        {isGitRepository ? <GithubSender /> : <InitializeRepoButton />}
                        <DownloadButton />
                    </div>

                    <div className="px-2 flex items-center justify-between text-xs text-zinc-400">
                        <span className="leading-none text-s text-zinc-500">{isGitRepository ? `${owner}/${repositoryName}` : name}</span>
                    </div>

                    <div className="absolute inset-0 -z-10 brightness-30">
                        <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
