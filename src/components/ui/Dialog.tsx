import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createDisclosureContext } from "@/components/ui/DisclosureContext";
import { PortalContainerProvider } from "@/components/ui/Portal";
import { Trigger } from "@/components/ui/Trigger";
import { cn } from "@/lib/utils";
import { createLocalStorage } from "@/lib/utils/createLocalStorage";

export interface DialogHandle {
    open: () => void;
    close: () => void;
}

const { Provider, useDisclosure } = createDisclosureContext<HTMLButtonElement>();
const DialogIdContext = createContext<string | null>(null);

function useDialogId() {
    const context = useContext(DialogIdContext);
    if (!context) throw new Error("Dialog components must be used within a Dialog");
    return context;
}

interface BaseDialogProps {
    className?: string;
    children: ReactNode;
}

export function Dialog(props: { children: ReactNode; id: string; className?: string; onOpenChange?: (open: boolean) => void }) {
    return (
        <DialogIdContext.Provider value={props.id}>
            <Provider>
                <div className={cn("relative inline-block", props.className)}>{props.children}</div>
            </Provider>
        </DialogIdContext.Provider>
    );
}

export function DialogTrigger(props: {
    children: ReactElement<{ ref?: React.Ref<HTMLElement>; onClick?: () => void; className?: string }>;
    className?: string;
    disabled?: boolean;
    onBeforeOpen?: () => boolean;
}) {
    const { setOpen, triggerRef } = useDisclosure();

    const handleToggle = () => {
        if (props.disabled) return;
        if (props.onBeforeOpen && !props.onBeforeOpen()) return;
        setOpen((prev) => !prev);
    };

    return (
        <Trigger
            elementRef={triggerRef}
            onToggle={handleToggle}
            className={cn(props.className, props.disabled && "opacity-50 cursor-not-allowed")}>
            {props.children}
        </Trigger>
    );
}

export function DialogContent(props: {
    children: ReactNode;
    className?: string;
    reminder?: boolean;
    defaultOpen?: boolean;
    ref?: React.Ref<DialogHandle>;
}) {
    const { open, setOpen } = useDisclosure();
    const dialogId = useDialogId();
    const reminderKey = props.reminder ? dialogId : `dialog-${dialogId}`;
    const storage = createLocalStorage(reminderKey, false);
    const [dialogElement, setDialogElement] = useState<HTMLDialogElement | null>(null);
    useImperativeHandle(props.ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false)
    }));

    const refCallback = (element: HTMLDialogElement | null) => {
        if (element !== dialogElement) setDialogElement(element);

        if (element) {
            if (open && !element.open) element.showModal();
            else if (!open && element.open) element.close();
            if (props.defaultOpen && !open && (!props.reminder || !storage.getValue())) {
                setOpen(true);
                props.reminder && storage.setValue(true);
            }
        }
    };

    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        setOpen(false);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            setOpen(false);
        }
    };

    return (
        <dialog
            ref={refCallback}
            id={dialogId}
            onCancel={handleCancel}
            onClick={handleBackdropClick}
            className={cn(
                "body-hidden m-auto w-2/5 min-w-[40%] max-w-[40%] rounded-xl bg-zinc-950 shadow-lg shadow-neutral-950 p-2 border border-zinc-800 backdrop:bg-black/50 backdrop:backdrop-blur-sm",
                props.className
            )}>
            <PortalContainerProvider container={dialogElement}>{props.children}</PortalContainerProvider>
        </dialog>
    );
}

export function DialogHeader(props: BaseDialogProps) {
    return <div className={cn("flex flex-col space-y-1.5 pb-4", props.className)}>{props.children}</div>;
}

export function DialogTitle(props: BaseDialogProps & { description?: ReactNode }) {
    const { setOpen } = useDisclosure();

    return (
        <div className={cn("flex shrink-0 items-center justify-between", props.className)}>
            {props.children}
            <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

export function DialogHero(props: { image: string; className?: string }) {
    return <img src={props.image} alt="Hero" className={cn("w-full aspect-16/6 object-cover rounded-lg", props.className)} />;
}

export function DialogDescription(props: BaseDialogProps) {
    return (
        <div className={cn("relative border-t border-zinc-800 py-4 leading-normal text-zinc-400 font-light", props.className)}>
            {props.children}
        </div>
    );
}

export function DialogBody(props: BaseDialogProps) {
    return <div className={cn("flex-1 overflow-y-auto min-h-0", props.className)}>{props.children}</div>;
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("flex shrink-0 flex-wrap items-center pt-4 justify-end gap-3", className)}>{children}</div>;
}

export function DialogCloseButton({ children, ...props }: { children?: ReactNode } & React.ComponentProps<typeof Button>) {
    const { setOpen } = useDisclosure();
    const { onClick, ...restProps } = props;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        if (onClick) onClick(e);
    };

    return (
        <Button type="button" onClick={handleClick} {...restProps}>
            {children}
        </Button>
    );
}
