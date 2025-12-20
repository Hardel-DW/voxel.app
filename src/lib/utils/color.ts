/**
 * Type representing an RGB color as a tuple of 3 numbers
 */
export type RGB = [number, number, number];

/**
 * Type representing a palette of RGB colors
 */
export type Palette = RGB[];

/**
 * Finds the closest color in a given palette using Euclidean distance
 * @param {Palette} colors - Palette of colors to search in
 * @param {RGB} color - Color to compare
 * @returns {RGB} The palette color closest to the given color
 * @example
 * const palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
 * const color = [240, 10, 10];
 * const closest = closest(palette, color); // Returns [255, 0, 0]
 */
export const closest = (colors: Palette, color: RGB): RGB => {
    return colors.reduce((nearest, current) => {
        const currentDistance = Math.sqrt((current[0] - color[0]) ** 2 + (current[1] - color[1]) ** 2 + (current[2] - color[2]) ** 2);
        const nearestDistance = Math.sqrt((nearest[0] - color[0]) ** 2 + (nearest[1] - color[1]) ** 2 + (nearest[2] - color[2]) ** 2);
        return currentDistance < nearestDistance ? current : nearest;
    });
};

/**
 * Calculates the distance between two RGB colors
 * @param {RGB} color1 - First color
 * @param {RGB} color2 - Second color
 * @returns {number} Distance between the two colors
 */
export const colorDistance = (color1: RGB, color2: RGB): number => {
    return Math.sqrt((color1[0] - color2[0]) ** 2 + (color1[1] - color2[1]) ** 2 + (color1[2] - color2[2]) ** 2);
};

/**
 * Cleans a palette by removing colors that are too similar
 * @param {Palette} palette - Palette to clean
 * @param threshold - Similarity threshold (0-442 where 0 = identical, 442 = very different)
 * @returns {Palette} New palette without colors that are too similar
 */
export const cleanPalette = (palette: Palette, threshold = 30): Palette => {
    return palette.reduce((acc: Palette, color) => {
        const isTooSimilar = acc.some((existingColor) => colorDistance(color, existingColor) < threshold);
        if (!isTooSimilar) acc.push(color);
        return acc;
    }, []);
};

/**
 * Extracts a color palette from an image by counting color frequency
 * @param {HTMLImageElement} image - The source image
 * @param {number} numColors - Number of colors to extract
 * @returns {Promise<Palette>} A promise containing the extracted color palette
 * @throws {Error} If the 2D context cannot be obtained
 * @example
 * const image = new Image();
 * image.src = "path/to/image.png";
 * const palette = await extractPalette(image, 8);
 */
export const extractPalette = async (image: HTMLImageElement, numColors: number): Promise<Palette> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colorMap = new Map<string, { color: RGB; count: number }>();

    for (let i = 0; i < imageData.data.length; i += 4) {
        const color: RGB = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
        const key = color.join(",");

        const existing = colorMap.get(key);
        if (existing) existing.count++;
        else colorMap.set(key, { color, count: 1 });
    }

    return Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, numColors)
        .map((item) => item.color);
};

/**
 * Quantizes an image by reducing its color palette
 * @param {HTMLImageElement} image - The source image to quantize
 * @param {Palette} palette - The color palette to use
 * @returns {Promise<ImageData>} A promise containing the quantized image data
 * @throws {Error} If the 2D context cannot be obtained
 * @example
 * const palette = [[255, 0, 0], [0, 255, 0], [0, 0, 255]];
 * const quantized = await quantizeImage(image, palette);
 */
export const quantizeImage = async (image: HTMLImageElement, palette: Palette): Promise<ImageData> => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = ctx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const originalColor: RGB = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
        const closestColor = closest(palette, originalColor);

        newImageData.data[i] = closestColor[0];
        newImageData.data[i + 1] = closestColor[1];
        newImageData.data[i + 2] = closestColor[2];
        newImageData.data[i + 3] = imageData.data[i + 3];
    }

    return newImageData;
};

/**
 * Loads an image from a file
 * @param {File} file - The image file to load
 * @returns {Promise<HTMLImageElement>} A promise containing the loaded Image element
 * @example
 * const fileInput = document.querySelector('input[type="file"]');
 * const image = await loadImage(fileInput.files[0]);
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            URL.revokeObjectURL(image.src);
            resolve(image);
        };
        image.onerror = reject;
    });
};
/**
 * Processes an image by reducing its color palette
 * @param {File} file - The image file to process
 * @param {number} numColors - Number of colors in the final palette
 * @param {HTMLCanvasElement} canvas - The canvas where to display the result
 * @returns {Promise<void>}
 * @throws {Error} If the 2D context cannot be obtained
 * @example
 * const canvas = document.getElementById('output');
 * await processImage(file, 8, canvas);
 */
export const processImage = async (file: File, numColors: number, canvas: HTMLCanvasElement): Promise<void> => {
    const image = await loadImage(file);
    canvas.width = image.width;
    canvas.height = image.height;

    const palette = await extractPalette(image, numColors);
    const quantizedImageData = await quantizeImage(image, palette);
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.putImageData(quantizedImageData, 0, 0);
};

/**
 * Converts an RGB color to HSL
 * @param {RGB} color - The RGB color to convert
 * @returns {[number, number, number]} The HSL representation [h, s, l]
 */
export const rgbToHsl = (color: RGB): [number, number, number] => {
    const r = color[0] / 255;
    const g = color[1] / 255;
    const b = color[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
};

/**
 * Sorts a palette of colors by hue
 * @param {Palette} palette - The palette to sort
 * @returns {Palette} The sorted palette
 */
export const sortPaletteByHue = (palette: Palette): Palette => {
    return [...palette].sort((a, b) => {
        const hslA = rgbToHsl(a);
        const hslB = rgbToHsl(b);
        return hslA[0] - hslB[0];
    });
};

/**
 * Generates a consistent color hash from a text input
 * @param str Input string
 * @returns Hue value (0-359)
 */
export const stringToColor = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
};

/**
 * Converts a hue value to HSL color string
 * @param hue Hue value (0-359)
 * @param saturation Saturation percentage (default: 70)
 * @param lightness Lightness percentage (default: 60)
 * @returns HSL color string
 */
export const hueToHsl = (hue: number, saturation = 70, lightness = 60): string => {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
