import { readFile } from "@tauri-apps/plugin-fs";
import { Datapack } from "@voxelio/breeze";

export interface DatapackLoadResult {
    datapack: ReturnType<Datapack["parse"]>;
    name: string;
    isModded: boolean;
}

function isValidExtension(name: string): boolean {
    return name.endsWith(".zip") || name.endsWith(".jar");
}

function extractFileName(path: string): string {
    const separator = path.includes("\\") ? "\\" : "/";
    return path.split(separator).pop() ?? path;
}

export async function loadDatapackFromFile(file: File): Promise<DatapackLoadResult> {
    if (!isValidExtension(file.name)) {
        throw new Error("Invalid file type. Expected .zip or .jar");
    }

    const datapack = await Datapack.from(file);
    const result = datapack.parse();
    const isModded = file.name.endsWith(".jar");

    return { datapack: result, name: file.name, isModded };
}

export async function loadDatapackFromPath(path: string): Promise<DatapackLoadResult> {
    const fileName = extractFileName(path);

    if (!isValidExtension(fileName)) {
        throw new Error("Invalid file type. Expected .zip or .jar");
    }

    const bytes = await readFile(path);
    const blob = new Blob([bytes]);
    const file = new File([blob], fileName, { type: "application/zip" });

    const datapack = await Datapack.from(file);
    const result = datapack.parse();
    const isModded = fileName.endsWith(".jar");

    return { datapack: result, name: fileName, isModded };
}
