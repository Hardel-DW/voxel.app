import { useNavigate } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import { useConfiguratorStore } from "@/components/tools/Store";
import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { t } from "@/lib/i18n";

export default function ProjectList() {
    const navigate = useNavigate();

    const handleFileUpload = async (files: FileList) => {
        try {
            const file = files[0];
            if (files.length === 0) throw new Error(t("studio.error.no_file"));
            if (files.length > 1) throw new Error(t("studio.error.multiple_files"));
            if (!file.name.endsWith(".zip") && !file.name.endsWith(".jar")) throw new Error(t("studio.error.invalid_file"));

            const datapack = await Datapack.from(file);
            const result = datapack.parse();

            useConfiguratorStore.getState().setup(result, file.name.endsWith(".jar"), file.name);
            toast(t("studio.success.loaded", { file: file.name }), TOAST.SUCCESS);
            navigate({ to: "/editor/enchantment/overview" });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("studio.error.failed_to_upload");
            toast(t("generic.dialog.error"), TOAST.ERROR, errorMessage);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-200">{t("studio.projects")}</h2>
            </div>

            <Dropzone
                onFileUpload={handleFileUpload}
                dropzone={{ accept: ".zip,.jar", maxSize: 100000000, multiple: false }}
                className="min-h-[200px] gap-4">
                <div className="size-14 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50 group-hover:scale-105 transition-transform">
                    <svg className="size-6 text-zinc-500 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-zinc-300 font-medium group-hover:text-white transition-colors">{t("studio.upload.start")}</p>
                    <p className="text-xs text-zinc-500 mt-1">{t("studio.upload.description")}</p>
                </div>
            </Dropzone>
        </div>
    );
}
