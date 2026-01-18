import { useTranslate } from "@/lib/i18n";

interface ErrorPlaceholderProps {
    error?: Error;
}

export default function ErrorPlaceholder({ error }: ErrorPlaceholderProps) {
    const t = useTranslate();

    return (
        <div className="bg-blue-50/5 ring-0 ring-zinc-700 relative transition-all p-6 rounded-xl">
            <div className="flex flex-col items-center justify-between gap-4 h-full">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-1">{t("error.title")}</h3>
                    <p className="text-sm text-zinc-400">{t("error.component")}</p>
                </div>

                <div className="h-16 w-16 flex items-center justify-center">
                    <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <div className="w-full">
                    <details className="text-xs text-zinc-400 pt-4 mt-4 border-t border-zinc-700">
                        <summary className="cursor-pointer">{t("error.details")}</summary>
                        <pre className="mt-2 whitespace-pre-wrap">{error?.message || t("error.component")}</pre>
                    </details>
                </div>
            </div>
        </div>
    );
}
