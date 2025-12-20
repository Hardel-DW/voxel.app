import { Button } from "@/components/ui/Button";
import type { BaseComponent } from "@/lib/hook/useBreezeElement";
import RenderGuard from "./RenderGuard";

// Type defined locally
export type ToolDonationType = BaseComponent & {
    icon: string;
    title: string;
    description: string;
    subTitle: string;
    extra: string[];
    tipText: {
        text: string;
        link: string;
    };
    patreon: {
        text: string;
        link: string;
    };
};

export default function Donation(props: ToolDonationType) {
    return (
        <RenderGuard condition={props.hide}>
            <div className="bg-black/35 border-t-2 border-l-2 rounded-2xl border-stone-900 ring-0 ring-zinc-800 overflow-hidden backdrop-blur-2xl relative mt-auto">
                <img className="absolute -top-24 -right-24 size-96 opacity-20" src={props.icon} alt="Voxel Labs" />

                <div className="flex flex-col justify-between h-full p-8 pl-12">
                    <div>
                        <h1 className="text-white text-3xl tracking-wide font-semibold">
                            {props.title}
                        </h1>
                        <p className="text-zinc-400 text-sm pt-2 w-full lg:w-3/4">
                            {props.description}
                        </p>
                    </div>
                    <div className="xl:flex justify-between gap-4 mt-4">
                        <div>
                            <h3 className="text-white font-bold text-xl pb-4 pt-6">
                                {props.subTitle}
                            </h3>
                            <ul className="grid grid-cols-2 gap-x-8 items-center *:flex *:items-center *:gap-2 gap-y-4">
                                {props.extra.map((item, index) => (
                                    <li key={index.toString()}>
                                        <img src="/icons/check.svg" alt="check" className="w-4 h-4 invert" />
                                        <span className="text-zinc-300 text-sm font-semibold">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:flex-none self-end relative z-10 gap-4 pt-8">
                            <Button
                                className="w-full flex-1 px-8"
                                target="_blank"
                                rel="noreferrer"
                                href={props.tipText.link}
                                variant="shimmer">
                                {props.tipText.text}
                            </Button>
                            <Button
                                className="w-full flex-1 px-8"
                                variant="patreon"
                                href={props.patreon.link}
                                target="_blank"
                                rel="noreferrer">
                                <img src="/icons/company/patreon.svg" alt="Patreon" className="w-4 h-4" />
                                {props.patreon.text}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 -z-10 hue-rotate-90 brightness-15">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>
            </div>
        </RenderGuard>
    );
}
