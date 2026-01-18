import { create } from "zustand";
import enUsDefault from "@/i18n/en-us.json";

export type Locale = "en-us" | "fr-fr";
export type TranslationParams = Record<string, string | number>;
export const supportedLocales: Locale[] = ["en-us", "fr-fr"];

interface I18nStore {
    locale: Locale;
    translations: Map<string, string>;
    isLoading: boolean;
    setLocale: (locale: Locale) => Promise<void>;
}

const loadLocaleData = async (locale: Locale): Promise<Record<string, string>> => {
    switch (locale) {
        case "en-us":
            return enUsDefault;
        case "fr-fr":
            return (await import("@/i18n/fr-fr.json")).default;
    }
};

const initTranslations = (data: Record<string, string>): Map<string, string> => new Map(Object.entries(data));
const interpolate = (str: string, params: TranslationParams): string => str.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
export const useI18n = create<I18nStore>((set, get) => ({
    locale: "en-us",
    translations: initTranslations(enUsDefault),
    isLoading: false,
    setLocale: async (locale: Locale) => {
        if (get().locale === locale) return;
        set({ isLoading: true });
        const data = await loadLocaleData(locale);
        set({ locale, translations: initTranslations(data), isLoading: false });
    }
}));

export const useTranslate = () => {
    const translations = useI18n((state) => state.translations);
    return (key: string | undefined, params?: TranslationParams): string => {
        if (!key) return "";
        const translation = translations.get(key);
        if (!translation) return key;
        return params ? interpolate(translation, params) : translation;
    };
};

/** Non-hook translate function for use in utility functions (reads directly from store) */
export const translate = (key: string | undefined, params?: TranslationParams): string => {
    if (!key) return "";
    const translation = useI18n.getState().translations.get(key);
    if (!translation) return key;
    return params ? interpolate(translation, params) : translation;
};
