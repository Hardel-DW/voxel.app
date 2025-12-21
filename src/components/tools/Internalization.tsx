import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { type Locale, setLocale, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SUPPORTED_LOCALES: Locale[] = ["en-us", "fr-fr"];

function getLocaleName(locale: Locale): string {
    const name = new Intl.DisplayNames(locale, { type: "language" }).of(locale) ?? locale;
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function Internalization() {
    const currentLocale = useLocale();
    const locales = SUPPORTED_LOCALES.map((locale) => ({
        code: locale,
        name: getLocaleName(locale)
    }));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/30">
                    <span className="uppercase font-medium tracking-wide">{currentLocale.split("-")[0]}</span>
                    <svg className="size-3 opacity-50" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 bg-sidebar">
                {locales.map((locale) => (
                    <DropdownMenuItem
                        key={locale.code}
                        onClick={() => setLocale(locale.code)}
                        className={cn("flex-row justify-between gap-4", locale.code === currentLocale && "text-white")}>
                        <span>{locale.name}</span>
                        {locale.code === currentLocale && (
                            <svg className="size-4" viewBox="0 0 12 12" fill="none">
                                <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
