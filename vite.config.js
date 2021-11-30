import { defineConfig } from 'vite'
import { minifyHtml } from 'vite-plugin-html'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3000
    },
    publicDir: 'public',
    base: './',
    build: {
        outDir: 'build',
        terserOptions: { format: { comments: false } },
    },
    plugins: [
        reactRefresh(),
        minifyHtml(),
    ],
    esbuild: {
        jsxInject: `import React from 'react'`
    },
    optimizeDeps: {
        include: ["swiper/react"],
    },
})
