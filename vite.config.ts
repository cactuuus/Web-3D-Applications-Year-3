import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/~jc2046/',
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                about: './about.html',
                viewer: './model.html',
            },
        },
    },
});
