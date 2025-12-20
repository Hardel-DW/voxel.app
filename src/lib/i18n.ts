import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { Store } from "@tauri-apps/plugin-store";
import { useSyncExternalStore } from "react";

export type Locale = "en-us" | "fr-fr";

const SUPPORTED_LOCALES: Set<Locale> = new Set(["en-us", "fr-fr"]);
const DEFAULT_LOCALE: Locale = "en-us";
const STORE_KEY = "lang";

type Translations = Record<string, string>;
type Subscriber = () => void;

class I18n {
    private locale: Locale = DEFAULT_LOCALE;
    private translations: Translations = {};
    private subscribers: Set<Subscriber> = new Set();
    private store: Store | null = null;
    private initialized = false;

    async init(): Promise<void> {
        if (this.initialized) return;

        this.store = await Store.load("settings.json");
        const stored = await this.store.get<Locale>(STORE_KEY);

        if (stored && SUPPORTED_LOCALES.has(stored)) {
            this.locale = stored;
        }

        await this.loadTranslations();
        this.initialized = true;
    }

    private async loadTranslations(): Promise<void> {
        const path = await resolveResource(`resources/i18n/${this.locale}.json`);
        const content = await readTextFile(path);
        this.translations = JSON.parse(content);
        this.notify();
    }

    private notify(): void {
        for (const sub of this.subscribers) sub();
    }

    subscribe(callback: Subscriber): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    getLocale(): Locale {
        return this.locale;
    }

    async setLocale(locale: Locale): Promise<void> {
        if (!SUPPORTED_LOCALES.has(locale) || locale === this.locale) return;

        this.locale = locale;
        await this.loadTranslations();

        if (this.store) {
            await this.store.set(STORE_KEY, locale);
            await this.store.save();
        }
    }

    translate(key: string, params?: Record<string, string | number>): string {
        const value = this.translations[key];
        if (!value) return key;
        if (!params) return value;

        return value.replace(/\{(\w+)\}/g, (_, k: string) => {
            const param = params[k];
            return param !== undefined ? String(param) : `{${k}}`;
        });
    }
}

const i18n = new I18n();

export const initI18n = (): Promise<void> => i18n.init();

export const setLocale = (locale: Locale): Promise<void> => i18n.setLocale(locale);

export const getLocale = (): Locale => i18n.getLocale();

export function useLocale(): Locale {
    return useSyncExternalStore(
        (cb) => i18n.subscribe(cb),
        () => i18n.getLocale()
    );
}

export function t(key: string, params?: Record<string, string | number>): string {
    return i18n.translate(key, params);
}

export function useT(): typeof t {
    useLocale();
    return t;
}
