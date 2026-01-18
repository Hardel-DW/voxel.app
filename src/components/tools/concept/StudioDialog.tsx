import { Dialog, DialogCloseButton, DialogContent, DialogFooter, DialogHeader, DialogHero } from "@/components/ui/Dialog";
import { MultiStep, MultiStepControl, MultiStepItem } from "@/components/ui/MultiStep";
import { useTranslate } from "@/lib/i18n";

const DIALOG_STEPS = [
    { id: "home", listCount: 3 },
    { id: "overview", listCount: 3 },
    { id: "edit", listCount: 2 },
    { id: "simulation", listCount: 3 },
    { id: "debug", listCount: 3 },
    { id: "export", listCount: 3 }
];

export default function StudioDialog() {
    const t = useTranslate();

    return (
        <Dialog id="studio-dialog">
            <DialogContent reminder defaultOpen className="sm:max-w-[800px]">
                <MultiStep>
                    {DIALOG_STEPS.map((step) => (
                        <MultiStepItem key={step.id}>
                            <DialogHeader>
                                <DialogHero image={`/images/background/dialog/studio/studio_${step.id}.webp`} />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    {t(`studio:dialog.${step.id}.title`)}
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>{t(`studio:dialog.${step.id}.body`)}</p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        {Array.from({ length: step.listCount }, (_, i) => (
                                            <li key={`${step.id}-${i}`}>{t(`studio:dialog.${step.id}.list.${i + 1}`)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                    ))}

                    <DialogFooter className="flex items-end justify-between">
                        <DialogCloseButton variant="ghost_border">{t("close")}</DialogCloseButton>
                        <MultiStepControl />
                    </DialogFooter>
                </MultiStep>
            </DialogContent>
        </Dialog>
    );
}
