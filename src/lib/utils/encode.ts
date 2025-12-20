export const encodeToBase64 = (bytes: Uint8Array): string => {
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        const slice = bytes.subarray(offset, offset + chunkSize);
        binary += String.fromCharCode(...slice);
    }
    return btoa(binary);
};

export function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

export function calculateBase64Size(content: string): number {
    const base64Length = content.length;
    const paddingLength = (content.match(/=/g) || []).length;
    return Math.ceil((base64Length * 3) / 4) - paddingLength;
}

export function calculateContentSize(content: string | null): number {
    if (content === null) return 0;
    if (content.startsWith("data:") || /^[A-Za-z0-9+/=]+$/.test(content)) {
        return calculateBase64Size(content);
    }
    return new Blob([content]).size;
}

export const encodeUint8Array = (data: Uint8Array): string => {
    const binaryString = Array.from(data, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binaryString);
};

export const decodeUint8Array = (encoded: string): Uint8Array => {
    const binaryString = atob(encoded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

export const encodeFilesRecord = (files: Record<string, Uint8Array>): Record<string, string> => {
    const encoded: Record<string, string> = {};
    for (const [key, value] of Object.entries(files)) {
        encoded[key] = encodeUint8Array(value);
    }
    return encoded;
};

export const decodeFilesRecord = (encoded: Record<string, string>): Record<string, Uint8Array> => {
    const decoded: Record<string, Uint8Array> = {};
    for (const [key, value] of Object.entries(encoded)) {
        decoded[key] = decodeUint8Array(value);
    }
    return decoded;
};
