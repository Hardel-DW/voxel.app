import { useState } from "react";

interface UseDragAndDropProps {
    onDrop?: (item: string, slotPath: string) => void;
    onSlotClear?: (slotPath: string) => void;
}

export function useDragAndDrop({ onDrop, onSlotClear }: UseDragAndDropProps = {}) {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dragPreviewElement, setDragPreviewElement] = useState<HTMLElement | null>(null);

    const handleDragStart = (e: React.DragEvent, item: string, preview?: HTMLElement | null) => {
        e.dataTransfer.setData("text/plain", item);
        e.dataTransfer.effectAllowed = "copy";
        setDraggedItem(item);

        if (preview) {
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.top = "-9999px";
            container.appendChild(preview.cloneNode(true));
            document.body.appendChild(container);
            setDragPreviewElement(container);

            const rect = preview.getBoundingClientRect();
            e.dataTransfer.setDragImage(container, rect.width / 2, rect.height / 2);
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        if (dragPreviewElement) {
            document.body.removeChild(dragPreviewElement);
            setDragPreviewElement(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e: React.DragEvent, slot: string) => {
        e.preventDefault();
        const item = e.dataTransfer.getData("text/plain");
        if (item) {
            onDrop?.(item, slot);
        }
        setDraggedItem(null);
    };

    const handleSlotClear = (slotPath: string) => {
        onSlotClear?.(slotPath);
    };

    return {
        draggedItem,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        handleSlotClear
    };
}
