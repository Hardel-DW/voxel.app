import { useEffect, useState } from "react";

export interface FileState {
    items: File[];
    currentIndex: number;
    objectUrls: Record<string, string>;
    current: File | null;
}

export default function useFileManager() {
    const [files, setFiles] = useState<Omit<FileState, "current">>({
        items: [],
        currentIndex: -1,
        objectUrls: {}
    });

    const addFiles = (newFiles: File[]) => {
        const newUrls: Record<string, string> = {};
        for (const file of newFiles) {
            const url = URL.createObjectURL(file);
            newUrls[file.name + file.lastModified] = url;
        }

        setFiles((prev) => {
            const updatedItems = [...prev.items, ...newFiles];
            return {
                items: updatedItems,
                currentIndex: updatedItems.length - 1,
                objectUrls: { ...prev.objectUrls, ...newUrls }
            };
        });

        return files.items.length; // Return the index of the first new file
    };

    const selectFile = (index: number) => {
        if (index === files.currentIndex || !files.items[index]) return false;

        setFiles((prev) => ({
            ...prev,
            currentIndex: index
        }));

        return true;
    };

    const deleteFile = (indexToDelete: number) => {
        const fileToDelete = files.items[indexToDelete];
        if (!fileToDelete) return { remaining: files.items, newIndex: files.currentIndex };

        const keyToDelete = fileToDelete.name + fileToDelete.lastModified;
        if (files.objectUrls[keyToDelete]) {
            URL.revokeObjectURL(files.objectUrls[keyToDelete]);
        }

        const remainingFiles = files.items.filter((_, i) => i !== indexToDelete);
        let newIndex = files.currentIndex;

        if (remainingFiles.length === 0) {
            newIndex = -1;
        } else if (files.currentIndex === indexToDelete) {
            newIndex = 0;
        } else if (files.currentIndex > indexToDelete) {
            newIndex = files.currentIndex - 1;
        }

        setFiles({
            items: remainingFiles,
            currentIndex: newIndex,
            objectUrls: Object.entries(files.objectUrls).reduce(
                (acc, [key, url]) => {
                    if (key !== keyToDelete) {
                        acc[key] = url;
                    }
                    return acc;
                },
                {} as Record<string, string>
            )
        });

        return { remaining: remainingFiles, newIndex };
    };

    const getCurrentFile = () => (files.currentIndex !== -1 ? files.items[files.currentIndex] : null);

    useEffect(() => {
        return () => {
            Object.values(files.objectUrls).forEach(URL.revokeObjectURL);
        };
    }, [files.objectUrls]);

    return {
        files: {
            items: files.items,
            currentIndex: files.currentIndex,
            objectUrls: files.objectUrls,
            current: getCurrentFile()
        },
        actions: {
            addFiles,
            selectFile,
            deleteFile
        }
    };
}
