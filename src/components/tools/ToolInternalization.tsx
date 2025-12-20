import { getLocale, type Locale, setLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function ToolInternalization() {
    const language = getLocale();
    const names = [
        { lang: "en-us", name: "English" },
        { lang: "fr-fr", name: "Français" }
    ];

    return (
        <div className="relative group/langage">
            <button type="button" className="text-sm text-zinc-400 truncate uppercase flex items-center gap-1 cursor-pointer">
                <span data-lang={language}>{language}</span>
                <img src="/icons/chevron-down.svg" alt="" className="w-4 h-4 invert-50" />
            </button>
            <ul className="group-focus-within/langage:flex hover:flex hidden bg-black border-t-2 border-l-2 border-stone-900 absolute top-8 right-0 w-44 p-2 flex-col gap-2 rounded-xl z-50 starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-all">
                {names.map((element) => (
                    <li key={element.lang}>
                        <button
                            type="button"
                            onClick={() => setLocale(element.lang as Locale)}
                            className={cn(
                                "flex items-center justify-between px-4 py-2 transition hover:bg-header-cloudy rounded-md w-full text-left cursor-pointer",
                                element.lang === language ? "font-semibold text-rose-700" : ""
                            )}>
                            {element.name}
                            {element.lang === language && (
                                <svg
                                    width="11"
                                    height="8"
                                    viewBox="0 0 11 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4">
                                    <path
                                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="0.4"
                                    />
                                </svg>
                            )}
                        </button>
                    </li>
                ))}
                <div className="absolute inset-0 -z-10 brightness-30">
                    <img src="/images/shine.avif" alt="Shine" loading="lazy" />
                </div>
            </ul>
        </div>
    );
}
