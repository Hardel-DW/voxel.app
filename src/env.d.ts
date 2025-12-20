/// <reference types="vite/client" />

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly VITE_DISABLE_GITHUB_ACTIONS: string;
        }
    }
}

export {};
