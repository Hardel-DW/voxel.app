export function ToolGrab() {
    return (
        <div className="flex items-center gap-4 pl-4 pointer-events-none user-select-none select-none" draggable={false}>
            <img
                src="/icons/grab.svg"
                alt="Tool Grab"
                className="size-4 invert-50 text-zinc-500 pointer-events-none user-select-none select-none"
                draggable={false}
            />
            <div className="h-4 w-px bg-zinc-800/50 pointer-events-none user-select-none select-none" draggable={false} />
        </div>
    );
}
