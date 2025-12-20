import { useQuery } from "@tanstack/react-query";
import { Identifier } from "@voxelio/breeze";
import { cn } from "@/lib/utils";

const user = "Hardel-DW";
const repo = "voxel.atlas";
const branch = "archives";
const path = `refs/heads/${branch}/items/data.min.json`;
const version = "1.21.11";

const getItems = async () => {
    const response = await fetch(`https://raw.githubusercontent.com/${user}/${repo}/${path}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    return response.json();
};

type Response = Record<string, [number, number, number, number]>;

// TODO: Fetch from JSON metadata
const ATLAS_WIDTH = 992;
const ATLAS_HEIGHT = 1024;

export default function TextureRenderer(props: { id: string; className?: string; size?: number }) {
    const { size = 40 } = props;
    const processId = Identifier.of(props.id, "item").toString();
    const { data, isLoading, error } = useQuery<Response>({
        queryKey: ["items", version],
        queryFn: getItems
    });

    if (isLoading) {
        return <div className="h-full w-full relative shrink-0 bg-gray-200 animate-pulse rounded-md" />;
    }
    if (error || !data || !(processId in data)) {
        return (
            <div className={cn("size-full relative flex items-center justify-center shrink-0", props.className)}>
                <img src="/icons/toast/error.svg" alt="Error" width={24} height={24} />
            </div>
        );
    }

    const [x, y, w, h] = data[processId];
    const scale = size / Math.max(w, h);

    return (
        <div className={cn("size-full relative flex items-center justify-center shrink-0", props.className)}>
            <div
                className="absolute pixelated"
                style={{
                    background: `url("/images/atlas.webp") no-repeat top left`,
                    width: size,
                    height: size,
                    backgroundSize: `${ATLAS_WIDTH * scale}px ${ATLAS_HEIGHT * scale}px`,
                    backgroundPosition: `${-x * scale}px ${-y * scale}px`
                }}
            />
        </div>
    );
}
