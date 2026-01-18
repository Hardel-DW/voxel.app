import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { useHomeStore } from "@/lib/store/HomeStore";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/Dialog";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getPresetById, LAUNCHER_PRESETS, scanLauncherInstances } from "@/lib/utils/instance/launchers";
import type { ClientType } from "@/lib/utils/instance/types";

type ValidationState = { status: "idle" } | { status: "validating" } | { status: "valid"; count: number } | { status: "invalid" };

export default function AddGameClientDialog() {
    const [preset, setPreset] = useState<ClientType>("vanilla");
    const [path, setPath] = useState("");
    const [validation, setValidation] = useState<ValidationState>({ status: "idle" });
    const addGameClient = useHomeStore((s) => s.addGameClient);
    const gameClients = useHomeStore((s) => s.gameClients);

    const validate = async (p: string, type: ClientType) => {
        if (!p.trim()) return setValidation({ status: "idle" });
        setValidation({ status: "validating" });
        const instances = await scanLauncherInstances(type, p);
        setValidation(instances.length > 0 ? { status: "valid", count: instances.length } : { status: "invalid" });
    };

    const initPath = async () => {
        const defaultPath = await getPresetById("vanilla")?.getDefaultPath();
        if (defaultPath) {
            setPath(defaultPath);
            validate(defaultPath, "vanilla");
        }
    };

    const handlePresetChange = async (id: ClientType) => {
        setPreset(id);
        const defaultPath = await getPresetById(id)?.getDefaultPath();
        if (defaultPath) {
            setPath(defaultPath);
            validate(defaultPath, id);
        }
    };

    const handleBrowse = async () => {
        const selected = await open({ directory: true, multiple: false });
        if (selected) {
            setPath(selected);
            validate(selected, preset);
        }
    };

    const handleAdd = async () => {
        if (validation.status !== "valid" || gameClients.some((c) => c.path === path)) return;
        await invoke("allow_directory", { path });
        const presetData = getPresetById(preset);
        if (!presetData) return;
        addGameClient({ name: presetData.name, type: preset, path, icon: presetData.icon });
    };

    return (
        <Dialog id="add-game-client-dialog" className="w-full">
            <DialogTrigger>
                <button
                    type="button"
                    onClick={initPath}
                    className="group flex items-center justify-center w-full py-4 rounded-xl border border-dashed cursor-pointer border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800/40 hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-zinc-800/60 group-hover:bg-zinc-700/60 transition-colors">
                            <svg
                                className="size-4 text-zinc-400 group-hover:text-zinc-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {t("tauri:home.addClient.button")}
                        </span>
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="w-5xl px-8 py-4">
                <DialogHeader>
                    <DialogTitle>
                        <h2 className="text-lg font-semibold text-zinc-200">{t("tauri:home.addClient.title")}</h2>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="space-y-5 py-3">
                    <div className="space-y-2">
                        <label htmlFor="launcher" className="text-sm font-medium text-zinc-400">
                            {t("tauri:home.addClient.launcher")}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {LAUNCHER_PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => handlePresetChange(p.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer",
                                        preset === p.id
                                            ? "border-zinc-600 bg-zinc-800/60"
                                            : "border-zinc-800/50 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                                    )}>
                                    <img src={p.icon} alt={p.name} className="size-7" />
                                    <span className="text-xs font-medium text-zinc-300">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label htmlFor="path" className="text-sm font-medium text-zinc-400">
                            {t("tauri:home.addClient.path")}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={path}
                                onChange={(e) => {
                                    setPath(e.target.value);
                                    validate(e.target.value, preset);
                                }}
                                placeholder={t("tauri:home.addClient.pathPlaceholder")}
                                className="flex-1 px-3 py-2 bg-zinc-900/60 border border-zinc-800/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                            <Button variant="ghost_border" onClick={handleBrowse} className="shrink-0">
                                {t("tauri:home.addClient.browse")}
                            </Button>
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter className="flex items-center justify-between mt-8">
                    {validation.status !== "idle" && (
                        <span
                            className={cn(
                                "text-sm font-medium",
                                validation.status === "validating" && "text-zinc-500",
                                validation.status === "valid" && "text-emerald-400",
                                validation.status === "invalid" && "text-red-400"
                            )}>
                            {validation.status === "validating" && t("tauri:home.addClient.status.validating")}
                            {validation.status === "valid" && t("tauri:home.addClient.status.valid", { count: validation.count })}
                            {validation.status === "invalid" && t("tauri:home.addClient.status.invalid")}
                        </span>
                    )}
                    <div className="flex gap-2 ml-auto">
                        <DialogCloseButton variant="ghost_border">{t("cancel")}</DialogCloseButton>
                        <DialogCloseButton variant="ghost" onClick={handleAdd} disabled={validation.status !== "valid"}>
                            {t("tauri:home.addClient.add")}
                        </DialogCloseButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
