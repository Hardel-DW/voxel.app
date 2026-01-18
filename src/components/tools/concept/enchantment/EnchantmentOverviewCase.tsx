import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import type { BaseInteractiveComponent } from "@/lib/hook/useInteractiveLogic";
import { useInteractiveLogic } from "@/lib/hook/useInteractiveLogic";
import { useTranslate } from "@/lib/i18n";

type OverviewCaseProps = BaseInteractiveComponent & {
    image: string;
    tag: string;
    title: string;
};

export default function OverviewCase(props: OverviewCaseProps) {
    const t = useTranslate();
    const { value } = useInteractiveLogic<OverviewCaseProps, boolean>({ component: props }, props.elementId);
    if (value === false) return null;

    return (
        <Popover>
            <PopoverTrigger>
                <img key={props.tag} src={props.image} alt="Tag" className="w-4 h-4 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-zinc-400">{t(props.title)}</p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
