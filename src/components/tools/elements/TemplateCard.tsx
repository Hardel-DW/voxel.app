import SimpleCard from "@/components/tools/elements/SimpleCard";

export default function TemplateCard(props: {
    image: string;
    title: string;
    description: string;
    short?: string;
    children: React.ReactNode;
}) {
    return (
        <SimpleCard>
            <div className="flex items-center justify-between w-full gap-4">
                <img src={props.image} alt="Images" className="h-16 pixelated invert" />
                {props.children}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-1">{props.title}</h3>
                {props.description && <p className="text-sm text-zinc-400">{props.description}</p>}
            </div>

            {props.short && <p className="text-xs text-zinc-400 pt-4 mt-4 border-t border-zinc-700">{props.short}</p>}
        </SimpleCard>
    );
}
