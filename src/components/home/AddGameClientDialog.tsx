import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";
import { type ClientType, useHomeStore } from "@/components/home/HomeStore";
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
import { getPresetById, LAUNCHER_PRESETS, scanLauncherInstances, validateMinecraftInstance } from "@/lib/utils/gameInstances";

type ValidationState = "idle" | "validating" | "valid" | "invalid";

export default function AddGameClientDialog() {
    const [selectedPreset, setSelectedPreset] = useState<ClientType>("vanilla");
    const [customPath, setCustomPath] = useState("");
    const [validationState, setValidationState] = useState<ValidationState>("idle");
    const [instanceCount, setInstanceCount] = useState(0);

    const addGameClient = useHomeStore((s) => s.addGameClient);
    const setClientInstances = useHomeStore((s) => s.setClientInstances);
    const gameClients = useHomeStore((s) => s.gameClients);

    const preset = getPresetById(selectedPreset);
    const isPathEmpty = customPath.trim() === "";
    const canAdd = validationState === "valid" && !isPathEmpty;

    const handlePresetChange = async (presetId: ClientType) => {
        setSelectedPreset(presetId);
        setValidationState("idle");
        setInstanceCount(0);

        const newPreset = getPresetById(presetId);
        if (newPreset) {
            const defaultPath = await newPreset.getDefaultPath();
            setCustomPath(defaultPath);
        }
    };

    const handleBrowse = async () => {
        const selected = await open({ directory: true, multiple: false });
        if (selected) {
            setCustomPath(selected);
            setValidationState("idle");
            setInstanceCount(0);
        }
    };

    const handleValidate = async () => {
        if (isPathEmpty) return;

        setValidationState("validating");
        const instances = await scanLauncherInstances(selectedPreset, customPath);

        if (instances.length > 0) {
            setValidationState("valid");
            setInstanceCount(instances.length);
        } else {
            const isValid = await validateMinecraftInstance(customPath);
            setValidationState(isValid ? "valid" : "invalid");
            setInstanceCount(isValid ? 1 : 0);
        }
    };

    const handleAdd = async () => {
        if (!canAdd || !preset) return;

        const existingClient = gameClients.find((c) => c.path === customPath);
        if (existingClient) return;

        const newClient = {
            name: preset.name,
            type: selectedPreset,
            path: customPath,
            icon: preset.icon
        };

        addGameClient(newClient);

        const instances = await scanLauncherInstances(selectedPreset, customPath);
        const clientId = useHomeStore.getState().gameClients.find((c) => c.path === customPath)?.id;

        if (clientId && instances.length > 0) {
            setClientInstances(clientId, instances);
        }

        resetState();
    };

    const resetState = () => {
        setSelectedPreset("vanilla");
        setCustomPath("");
        setValidationState("idle");
        setInstanceCount(0);
    };

    return (
        <Dialog id="add-game-client-dialog">
            <DialogTrigger>
                <AddButton />
            </DialogTrigger>

            <DialogContent className="w-[500px] min-w-[500px] max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        <h2 className="text-lg font-semibold text-zinc-200">{t("home.addClient.title")}</h2>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody className="space-y-6 py-4">
                    <PresetSelector value={selectedPreset} onChange={handlePresetChange} />

                    <PathInput value={customPath} onChange={setCustomPath} onBrowse={handleBrowse} />

                    <ValidationSection
                        state={validationState}
                        instanceCount={instanceCount}
                        onValidate={handleValidate}
                        disabled={isPathEmpty}
                    />
                </DialogBody>

                <DialogFooter>
                    <DialogCloseButton variant="ghost_border" onClick={resetState}>
                        {t("cancel")}
                    </DialogCloseButton>
                    <DialogCloseButton variant="default" onClick={handleAdd} disabled={!canAdd}>
                        {t("home.addClient.add")}
                    </DialogCloseButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddButton() {
    return (
        <button
            type="button"
            className={cn(
                "group relative flex flex-col items-center justify-center w-full p-6 transition-all duration-300 rounded-3xl border-2 border-dashed cursor-pointer",
                "border-zinc-700/50 bg-zinc-900/20 backdrop-blur-sm",
                "hover:bg-zinc-800/30 hover:border-zinc-500"
            )}>
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors">
                    <svg className="w-6 h-6 text-zinc-400 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-zinc-200 transition-colors">
                        {t("home.addClient.button")}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">{t("home.addClient.buttonHint")}</p>
                </div>
            </div>
        </button>
    );
}

function PresetSelector(props: { value: ClientType; onChange: (value: ClientType) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{t("home.addClient.launcher")}</label>
            <div className="grid grid-cols-3 gap-2">
                {LAUNCHER_PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => props.onChange(preset.id)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                            props.value === preset.id
                                ? "border-zinc-500 bg-zinc-800/50"
                                : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                        )}>
                        <img src={preset.icon} alt={preset.name} className="w-8 h-8" />
                        <span className="text-xs font-medium text-zinc-300">{preset.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function PathInput(props: { value: string; onChange: (value: string) => void; onBrowse: () => void }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">{t("home.addClient.path")}</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder={t("home.addClient.pathPlaceholder")}
                    className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
                <Button variant="ghost_border" onClick={props.onBrowse}>
                    {t("home.addClient.browse")}
                </Button>
            </div>
        </div>
    );
}

function ValidationSection(props: { state: ValidationState; instanceCount: number; onValidate: () => void; disabled: boolean }) {
    return (
        <div className="space-y-3">
            <Button
                variant="ghost_border"
                onClick={props.onValidate}
                disabled={props.disabled || props.state === "validating"}
                className="w-full">
                {props.state === "validating" ? t("home.addClient.validating") : t("home.addClient.validate")}
            </Button>

            <ValidationStatus state={props.state} instanceCount={props.instanceCount} />
        </div>
    );
}

function ValidationStatus(props: { state: ValidationState; instanceCount: number }) {
    if (props.state === "idle") return null;

    const statusConfig = {
        validating: { color: "text-zinc-400", icon: "⏳", message: t("home.addClient.status.validating") },
        valid: { color: "text-green-400", icon: "✓", message: t("home.addClient.status.valid", { count: props.instanceCount }) },
        invalid: { color: "text-red-400", icon: "✗", message: t("home.addClient.status.invalid") }
    };

    const config = statusConfig[props.state];

    return (
        <div className={cn("flex items-center gap-2 text-sm", config.color)}>
            <span>{config.icon}</span>
            <span>{config.message}</span>
        </div>
    );
}
