import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { useHomeStore } from "@/components/home/HomeStore";
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
import { type ClientType, getPresetById, LAUNCHER_PRESETS, scanInstanceWorlds, scanLauncherInstances } from "@/lib/utils/instance";

export type ValidationState = "idle" | "validating" | "valid" | "invalid";
export default function AddGameClientDialog() {
    const [selectedPreset, setSelectedPreset] = useState<ClientType>("vanilla");
    const [customPath, setCustomPath] = useState("");
    const [validationState, setValidationState] = useState<ValidationState>("idle");
    const [instanceCount, setInstanceCount] = useState(0);
    const [initialized, setInitialized] = useState(false);
    const addGameClient = useHomeStore((s) => s.addGameClient);
    const setClientInstances = useHomeStore((s) => s.setClientInstances);
    const setInstanceWorlds = useHomeStore((s) => s.setInstanceWorlds);
    const gameClients = useHomeStore((s) => s.gameClients);
    const preset = getPresetById(selectedPreset);
    const isPathEmpty = customPath.trim() === "";
    const canAdd = validationState === "valid" && !isPathEmpty;

    const initializeDefaultPath = async () => {
        if (initialized) return;
        setInitialized(true);
        const defaultPreset = getPresetById("vanilla");
        if (defaultPreset) {
            const defaultPath = await defaultPreset.getDefaultPath();
            setCustomPath(defaultPath);
            validatePath(defaultPath, "vanilla");
        }
    };

    const validatePath = async (path: string, type: ClientType) => {
        if (!path.trim()) {
            setValidationState("idle");
            setInstanceCount(0);
            return;
        }

        setValidationState("validating");
        const instances = await scanLauncherInstances(type, path);
        if (instances.length === 0) {
            setValidationState("invalid");
            setInstanceCount(0);
            return;
        }

        setValidationState("valid");
        setInstanceCount(instances.length);
    };

    const handlePresetChange = async (presetId: ClientType) => {
        setSelectedPreset(presetId);
        setValidationState("idle");
        setInstanceCount(0);

        const newPreset = getPresetById(presetId);
        if (newPreset) {
            const defaultPath = await newPreset.getDefaultPath();
            setCustomPath(defaultPath);
            validatePath(defaultPath, presetId);
        }
    };

    const handlePathChange = (path: string) => {
        setCustomPath(path);
        validatePath(path, selectedPreset);
    };

    const handleBrowse = async () => {
        const selected = await open({ directory: true, multiple: false });
        if (selected) {
            setCustomPath(selected);
            validatePath(selected, selectedPreset);
        }
    };

    const handleAdd = async () => {
        if (!canAdd || !preset) return;
        const existingClient = gameClients.find((c) => c.path === customPath);
        if (existingClient) return;

        await invoke("allow_directory", { path: customPath });

        const newClient = { name: preset.name, type: selectedPreset, path: customPath, icon: preset.icon };
        addGameClient(newClient);

        const instances = await scanLauncherInstances(selectedPreset, customPath);
        const clientId = useHomeStore.getState().gameClients.find((c) => c.path === customPath)?.id;
        if (clientId && instances.length > 0) {
            setClientInstances(clientId, instances);

            const storedInstances = useHomeStore.getState().gameInstances.filter((i) => i.clientId === clientId);
            for (const instance of storedInstances) {
                const worlds = await scanInstanceWorlds(instance.path);
                if (worlds.length > 0) {
                    setInstanceWorlds(instance.id, worlds);
                }
            }
        }
    };

    return (
        <Dialog id="add-game-client-dialog" className="w-full">
            <DialogTrigger>
                <button
                    type="button"
                    onClick={initializeDefaultPath}
                    className="group relative flex items-center justify-center w-full py-4 transition-all duration-200 rounded-xl border border-dashed cursor-pointer border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800/40 hover:border-zinc-600">
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
                            {t("home.addClient.button")}
                        </span>
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="w-5xl px-8 py-4">
                <DialogHeader>
                    <DialogTitle>
                        <h2 className="text-lg font-semibold text-zinc-200">{t("home.addClient.title")}</h2>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="space-y-5 py-3">
                    <div className="space-y-2">
                        <label htmlFor="launcher" className="text-sm font-medium text-zinc-400">
                            {t("home.addClient.launcher")}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {LAUNCHER_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handlePresetChange(preset.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer border-zinc-600 bg-zinc-800/60",
                                        selectedPreset !== preset.id && "border-zinc-800/50 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                                    )}>
                                    <img src={preset.icon} alt={preset.name} className="size-7" />
                                    <span className="text-xs font-medium text-zinc-300">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label htmlFor="path" className="text-sm font-medium text-zinc-400">
                            {t("home.addClient.path")}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customPath}
                                onChange={(e) => handlePathChange(e.target.value)}
                                placeholder={t("home.addClient.pathPlaceholder")}
                                className="flex-1 px-3 py-2 bg-zinc-900/60 border border-zinc-800/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                            <Button variant="ghost_border" onClick={handleBrowse} className="shrink-0">
                                {t("home.addClient.browse")}
                            </Button>
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter className="flex items-center justify-between mt-24">
                    {validationState !== "idle" && (
                        <span
                            className={cn(
                                "text-sm font-medium",
                                validationState === "validating" && "text-zinc-500",
                                validationState === "valid" && "text-emerald-400",
                                validationState === "invalid" && "text-red-400"
                            )}>
                            {validationState === "validating" && t("home.addClient.status.validating")}
                            {validationState === "valid" && t("home.addClient.status.valid", { count: instanceCount })}
                            {validationState === "invalid" && t("home.addClient.status.invalid")}
                        </span>
                    )}
                    <div className="flex gap-2">
                        <DialogCloseButton variant="ghost_border">
                            {t("cancel")}
                        </DialogCloseButton>
                        <DialogCloseButton variant="ghost" onClick={handleAdd} disabled={!canAdd}>
                            {t("home.addClient.add")}
                        </DialogCloseButton>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
