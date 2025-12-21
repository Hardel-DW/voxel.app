import { readFile } from "@tauri-apps/plugin-fs";
import { Datapack } from "@voxelio/breeze";

export interface DatapackLoadResult {
    datapack: ReturnType<Datapack["parse"]>;
    name: string;
    isModded: boolean;
}

export async function loadDatapackFromPath(path: string): Promise<DatapackLoadResult> {
    const fileName = path.split(path.includes("\\") ? "\\" : "/").pop() ?? path;
    if (!(fileName.endsWith(".zip") || fileName.endsWith(".jar"))) {
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
