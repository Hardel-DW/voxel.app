import type React from "react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface Props {
    children: React.ReactNode;
    dropzone: {
        accept: string;
        maxSize: number;
        multiple: boolean;
    };
    onFileUpload: (files: FileList) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
}

export default function Dropzone({ dropzone, onFileUpload, children, id, disabled, className }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const uniqueId = useId();
    const fileInputId = `dropzone-file-${uniqueId}`;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileUpload(event.target.files);
            event.target.value = "";
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            onFileUpload(files);
        }
    };

    return (
        <label
            htmlFor={fileInputId}
            id={id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "group relative flex flex-col items-center justify-center w-full h-full p-6 transition-all duration-300 rounded-3xl border-2 border-dashed cursor-pointer",
                "border-zinc-700/50 bg-zinc-900/20 backdrop-blur-sm",
                "hover:bg-zinc-800/30 hover:border-zinc-500",
                isDragging && "bg-zinc-800/30 border-zinc-500",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}>
            {children}
            <input
                id={fileInputId}
                type="file"
                className="hidden"
                accept={dropzone.accept}
                multiple={dropzone.multiple}
                onChange={handleFileChange}
                disabled={disabled}
            />
        </label>
    );
}
