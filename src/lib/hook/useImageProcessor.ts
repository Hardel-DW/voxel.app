import { useEffect, useState } from "react";
import { cleanPalette, extractPalette, quantizeImage, type RGB } from "@/lib/utils/color";

export default function useImageProcessor() {
    const [palette, setPalette] = useState({
        original: [] as RGB[],
        cleaned: [] as RGB[]
    });
    const [imageState, setImageState] = useState({
        hasQuantizedData: false,
        isLoading: false,
        processingTimeout: null as NodeJS.Timeout | null
    });

    const resetPalette = () => setPalette({ original: [], cleaned: [] });

    const processImage = async (image: HTMLImageElement, threshold: number) => {
        try {
            const originalPalette = await extractPalette(image, 256);
            const cleanedPalette = cleanPalette(originalPalette, threshold);
            const quantized = await quantizeImage(image, cleanedPalette);

            setPalette({ original: originalPalette, cleaned: cleanedPalette });
            return { quantizedData: quantized, success: true };
        } catch (error) {
            console.error("Error processing image:", error);
            resetPalette();
            return { quantizedData: null, success: false };
        }
    };

    const startLoading = () => {
        const timeout = setTimeout(() => {
            setImageState((prev) => ({ ...prev, isLoading: true }));
        }, 150);

        setImageState((prev) => ({
            ...prev,
            processingTimeout: timeout
        }));

        return timeout;
    };

    const stopLoading = () => {
        setImageState((prev) => {
            if (prev.processingTimeout) {
                clearTimeout(prev.processingTimeout);
            }
            return { ...prev, isLoading: false, processingTimeout: null };
        });
    };

    const setHasQuantizedData = (value: boolean) => {
        setImageState((prev) => ({ ...prev, hasQuantizedData: value }));
    };

    const deleteColorFromCleaned = (colorToDelete: RGB) => {
        const newCleaned = palette.cleaned.filter(
            (c) => !(c[0] === colorToDelete[0] && c[1] === colorToDelete[1] && c[2] === colorToDelete[2])
        );

        setPalette((prev) => ({
            ...prev,
            cleaned: newCleaned
        }));
        return newCleaned;
    };

    const deleteColor = (colorToDelete: RGB) => {
        const newOriginal = palette.original.filter(
            (c) => !(c[0] === colorToDelete[0] && c[1] === colorToDelete[1] && c[2] === colorToDelete[2])
        );

        setPalette((prev) => ({
            ...prev,
            original: newOriginal
        }));
        return newOriginal;
    };

    const updateCleanedPalette = (newCleanedPalette: RGB[]) => {
        setPalette((prev) => ({
            ...prev,
            cleaned: newCleanedPalette
        }));
    };

    useEffect(() => {
        return () => {
            if (imageState.processingTimeout) {
                clearTimeout(imageState.processingTimeout);
            }
        };
    }, [imageState.processingTimeout]);

    return {
        palette,
        imageState: {
            hasQuantizedData: imageState.hasQuantizedData,
            isLoading: imageState.isLoading
        },
        actions: {
            processImage,
            startLoading,
            stopLoading,
            setHasQuantizedData,
            deleteColor,
            deleteColorFromCleaned,
            resetPalette,
            updateCleanedPalette
        }
    };
}
