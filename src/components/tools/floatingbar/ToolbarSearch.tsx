import { TextInput } from "@/components/ui/TextInput";

interface ToolbarSearchProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export function ToolbarSearch({ placeholder, value, onChange, onSubmit }: ToolbarSearchProps) {
    return (
        <div className="flex-1 relative">
            <TextInput
                placeholder={placeholder}
                defaultValue={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && onSubmit) {
                        onSubmit(e.currentTarget.value);
                    }
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="min-w-64 "
            />
        </div>
    );
}
