import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte(), wasm(), topLevelAwait()],
    resolve: {
        alias: {
            $lib: path.resolve('./src/lib'),
            $wasm: path.resolve('./src/wasm')
        }
    },
    base: ''
});
