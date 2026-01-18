import { useNavigate, useParams } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown";
import { type Locale, supportedLocales } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Internalization() {
    const { lang } = useParams({ from: "/$lang" });
    const navigate = useNavigate();

    const handleLanguageChange = (newLang: Locale) => {
        navigate({ to: ".", params: { lang: newLang } });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-zinc-800/30">
                    <span className="uppercase font-medium tracking-wide">{lang.split("-")[0]}</span>
                    <svg className="size-3 opacity-50" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 bg-sidebar">
                {supportedLocales.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        className={cn("flex-row justify-between gap-4", locale === lang && "text-white")}>
                        <span>{new Intl.DisplayNames([locale], { type: "language" }).of(locale.split("-")[0]) ?? locale}</span>
                        {locale === lang && (
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
