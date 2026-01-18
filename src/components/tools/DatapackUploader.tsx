import { useNavigate } from "@tanstack/react-router";
import { Datapack } from "@voxelio/breeze";
import Dropzone from "@/components/ui/Dropzone";
import { TOAST, toast } from "@/components/ui/Toast";
import { useTranslate } from "@/lib/i18n";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { Route } from "@/routes/$lang";

export default function DatapackUploader() {
    const t = useTranslate();
    const navigate = useNavigate();
    const { lang } = Route.useParams();

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
            navigate({ to: "/$lang/studio/editor/enchantment/overview", params: { lang } });
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : t("studio.error.failed_to_upload");
            toast(t("generic.dialog.error"), TOAST.ERROR, errorMessage);
        }
    };

    return (
        <Dropzone
            onFileUpload={handleFileUpload}
            dropzone={{ accept: ".zip,.jar", maxSize: 100000000, multiple: false }}
            className="gap-6 p-12 min-h-[300px]">
            <div className="size-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <img src="/icons/upload.svg" className="size-10 opacity-50 group-hover:opacity-100 transition-opacity" alt="Upload" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-zinc-200 font-medium text-xl group-hover:text-white transition-colors">{t("studio.upload.start")}</p>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">{t("studio.upload.description")}</p>
            </div>
        </Dropzone>
    );
}
