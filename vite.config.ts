import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import reactScan from './src/lib/scan'

const host = process.env.TAURI_DEV_HOST;
export default defineConfig(async () => ({
    plugins: [
        reactScan(),
        tailwindcss(),
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler'],
                ],
            },
        }),
    ],
    resolve: {
        tsconfigPaths: true
    },
    clearScreen: false,
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
}));