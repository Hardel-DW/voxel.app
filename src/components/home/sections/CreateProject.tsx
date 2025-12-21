import { useNavigate } from "@tanstack/react-router";
import { Datapack, Logger } from "@voxelio/breeze";
import { useHomeStore } from "@/components/home/HomeStore";
import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";

export default function CreateProject() {
    const navigate = useNavigate();
    const addRecentProject = useHomeStore((s) => s.addRecentProject);

    const handleNewProject = () => {
        const mcmeta = { pack: { pack_format: 61, description: "New Voxel Project" } };
        const files = new Datapack({ "pack.mcmeta": new TextEncoder().encode(JSON.stringify(mcmeta)) }).getFiles();
        const logger = new Logger(files);

        useConfiguratorStore.getState().setup({ files, elements: new Map(), version: 61, logger }, false, "New Project");
        navigate({ to: "/editor/enchantment/overview" });
    };

    const handleFileUpload = async (files: FileList) => {
        try {
            const file = files[0];
            if (files.length === 0) throw new Error(t("studio.error.no_file"));
            if (files.length > 1) throw new Error(t("studio.error.multiple_files"));
            if (!file.name.endsWith(".zip") && !file.name.endsWith(".jar")) throw new Error(t("studio.error.invalid_file"));

            const datapack = await Datapack.from(file);
            const result = datapack.parse();
            const isModded = file.name.endsWith(".jar");
            useConfiguratorStore.getState().setup(result, isModded, file.name);
            addRecentProject({ name: file.name, path: file.name, type: isModded ? "mod" : "datapack" });
            toast(t("studio.success.loaded", { file: file.name }), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("studio.error.failed_to_upload");
            toast(t("generic.dialog.error"), TOAST.ERROR, errorMessage);
        }
    };

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">{t("home.create.title")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <button
                    type="button"
                    onClick={handleNewProject}
                    className="group flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/15 hover:to-emerald-600/10 transition-all cursor-pointer">
                    <div className="size-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="size-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-emerald-300">{t("home.create.scratch")}</p>
                        <p className="text-xs text-emerald-500/70 mt-1">{t("home.create.scratch.hint")}</p>
                    </div>
                </button>

                <Dropzone
                    onFileUpload={handleFileUpload}
                    dropzone={{ accept: ".zip,.jar", maxSize: 100000000, multiple: false }}
                    className="lg:col-span-2 min-h-[160px] gap-4 bg-zinc-900/30">
                    <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <svg className="size-7 text-zinc-500 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                                {t("home.create.upload")}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">{t("home.create.upload.hint")}</p>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-500 border border-zinc-700/30">.zip</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-500 border border-zinc-700/30">.jar</span>
                            </div>
                        </div>
                    </div>
                </Dropzone>
            </div>
        </section>
    );
}
