import { getMinecraftVersion } from "@voxelio/breeze";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StatusBoxProps {
    files: FileList;
    version: number;
    onResetAction: () => void;
    variant?: "success" | "error";
    reason?: string;
}

export function StatusBox({ files, version, onResetAction, variant = "success", reason }: StatusBoxProps) {
    const variants = {
        success: {
            container: "border-green-500 bg-green-950/50",
            text: "dark:text-green-400",
            subtext: "text-green-500",
            divider: "from-green-700",
            button: "text-green-600 border-green-700 hover:bg-green-700/10",
            icon: (
                <svg className="w-full h-full text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>{t("migration.box.success")}</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        error: {
            container: "border-red-500 bg-red-950/50",
            text: "text-red-600 dark:text-red-400",
            subtext: "text-red-500 dark:text-red-500",
            divider: "from-red-400",
            button: "text-red-400 border-red-900 hover:bg-red-700/10",
            icon: (
                <svg className="w-full h-full text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>{t("migration.box.error")}</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        }
    };

    const currentVariant = variants[variant];

    return (
        <div
            className={cn(
                "flex h-full items-center justify-center p-6 rounded-lg border-2",
                "transition-all duration-300",
                currentVariant.container
            )}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12">{currentVariant.icon}</div>
                    <div className="flex flex-col">
                        <p className={cn("text-sm font-medium", currentVariant.text)}>{files[0].name}</p>
                        {reason ? (
                            <p className={cn("text-xs", currentVariant.subtext)}>{reason}</p>
                        ) : (
                            <p className={cn("text-xs", currentVariant.subtext)}>Minecraft {getMinecraftVersion(version)}</p>
                        )}
                    </div>
                </div>

                <div className="w-full flex items-center gap-x-4">
                    <div className={cn("h-px flex-1 bg-linear-to-l to-transparent", currentVariant.divider)} />
                    <img src="/icons/star.svg" alt="star" className="size-6 invert" />
                    <div className={cn("h-px flex-1 bg-linear-to-r to-transparent", currentVariant.divider)} />
                </div>

                <Button type="button" onClick={onResetAction} variant="default" className={cn("bg-transparent", currentVariant.button)}>
                    {t("migration.change")}
                </Button>
            </div>
        </div>
    );
}
