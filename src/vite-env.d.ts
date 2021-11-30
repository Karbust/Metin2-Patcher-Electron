/// <reference types="vite/client" />

export {}

declare global {
    interface Window {
        require: any;
    }
}

declare module 'i18next-electron-fs-backend'
