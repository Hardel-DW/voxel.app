import type { VoxelElement } from "@voxelio/breeze";

export type Condition = (el: any) => boolean;
export type Lock = { text: string; condition: Condition };
export type LockRenderer = { isLocked: boolean; text?: string };

export function checkLocks(locks: Lock[] | undefined, element: VoxelElement): LockRenderer {
    if (!locks) return { isLocked: false };

    for (const lock of locks) {
        if (lock.condition(element)) {
            return { isLocked: true, text: lock.text };
        }
    }

    return { isLocked: false };
}

export class LockEntryBuilder {
    private text: string | undefined;
    private condition: Condition | undefined;

    public addText(text: string): this {
        this.text = text;
        return this;
    }

    public addTextKey(key: string): this {
        this.text = key;
        return this;
    }

    public addCondition(condition: Condition): this {
        this.condition = condition;
        return this;
    }

    public build(): Lock {
        if (!this.text || !this.condition) {
            throw new Error("Text and condition are required");
        }

        return { text: this.text, condition: this.condition };
    }
}

export const isMinecraft = new LockEntryBuilder()
    .addTextKey("vanilla_disabled")
    .addCondition((el: VoxelElement) => el.identifier?.namespace === "minecraft")
    .build();
