/**
 * Télécharge n'importe quel contenu comme fichier
 */
export const downloadFile = async (content: Response | Blob | string, filename: string, mimeType = "text/plain") => {
    if (typeof window === "undefined") return;

    const blob =
        content instanceof Response ? await content.blob() : content instanceof Blob ? content : new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
        href: url,
        download: filename
    }).click();
    URL.revokeObjectURL(url);
};

/**
 * Télécharge une image à partir d'un canvas
 * @param canvas Le canvas contenant l'image
 * @param filename Le nom de fichier souhaité (optionnel)
 * @param format Le format de l'image ('png' par défaut)
 */
export const downloadCanvas = (canvas: HTMLCanvasElement, filename = "image.png", format = "png") => {
    if (typeof window === "undefined" || !canvas) return;

    const mimeType = `image/${format}`;
    const url = canvas.toDataURL(mimeType);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
