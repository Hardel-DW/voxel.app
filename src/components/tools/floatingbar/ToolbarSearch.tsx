import { TextInput } from "@/components/ui/TextInput";
import { useTranslate } from "@/lib/i18n";

interface ToolbarSearchProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export function ToolbarSearch({ placeholder = "search.placeholder", value, onChange, onSubmit }: ToolbarSearchProps) {
    const t = useTranslate();
    const translatedPlaceholder = t(placeholder);

    return (
        <div className="flex-1 relative">
            <TextInput
                placeholder={translatedPlaceholder}
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
