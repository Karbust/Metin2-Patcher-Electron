import { existsSync, writeFileSync, readFileSync } from 'fs'
import { spawn } from 'child_process'

import i18next from 'i18next'
import isDev from 'electron-is-dev'
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    BrowserWindow, ipcMain, dialog, MessageChannelMain, shell
} from 'electron'

import {
    binaryName,
    configName,
    debugFolder,
    enableLocaleCfgUpdate,
    enableSlider,
    launchParameters,
    localeCfgPath,
    locales,
    serverName
} from '../src/config'

import i18n from './i18n'

export default class Main {
    static mainWindow: Electron.BrowserWindow

    static workerWindow: Electron.BrowserWindow

    static application: Electron.App

    static BrowserWindow: any

    static settingsFile = `${isDev ? debugFolder : process.env.PORTABLE_EXECUTABLE_DIR}\\patcher_settings`

    static localeCfgFile = `${isDev ? debugFolder : process.env.PORTABLE_EXECUTABLE_DIR}\\${localeCfgPath}`

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit()
        }
    }

    private static onClose() {
        // @ts-ignore
        Main.mainWindow = null
        // @ts-ignore
        Main.workerWindow = null
    }

    private static onReady() {
        Main.workerWindow = new BrowserWindow({
            show: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true
            }
        })
        Main.workerWindow.loadFile(isDev ? '../../../public/worker.html' : 'build/worker.html')

        Main.mainWindow = new Main.BrowserWindow({
            width: 800,
            height: enableSlider ? 520 : 200,
            resizable: false,
            fullscreenable: isDev,
            //transparent: true,
            frame: false,
            useContentSize: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                enableRemoteModule: true
            }
        })
        Main.mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${__dirname}/../../index.html`)
        Main.mainWindow.on('closed', Main.onClose)

        if (isDev) {
            Main.mainWindow.webContents.openDevTools({ mode: 'detach' })
        }

        if (!existsSync(Main.settingsFile)) {
            const obj: any = { language: 'en' }
            writeFileSync(Main.settingsFile, JSON.stringify(obj))
            i18next.changeLanguage('en')
        } else {
            const { language } = JSON.parse(readFileSync(Main.settingsFile, 'utf8'))
            i18next.changeLanguage(language)
        }

        ipcMain.on('minimize', () => Main.mainWindow.minimize())

        ipcMain.on('close', () => {
            dialog.showMessageBox(Main.mainWindow, {
                type: 'question',
                title: serverName,
                message: 'Are you sure you want to quit?',
                noLink: true,
                cancelId: 1,
                buttons: ['Quit', 'Cancel']
            }).then((confirmation) => {
                if (confirmation.response === 0) {
                    Main.application.quit()
                }
            })
        })

        ipcMain.on('launchClient', () => {
            spawn(binaryName, launchParameters, {
                detached: true,
                cwd: isDev ? debugFolder : process.env.PORTABLE_EXECUTABLE_DIR
            })
        })

        ipcMain.on('launchConfig', () => {
            spawn(configName, launchParameters, {
                detached: true,
                cwd: isDev ? debugFolder : process.env.PORTABLE_EXECUTABLE_DIR
            })
        })

        ipcMain.on('launchUrl', async (_, args) => {
            await shell.openExternal(args.url)
        })

        ipcMain.on('languageChange', async (_, args) => {
            const settings = JSON.parse(readFileSync(Main.settingsFile, 'utf8'))
            settings.language = args.language
            await i18next.changeLanguage(args.language)
            writeFileSync(Main.settingsFile, JSON.stringify(settings))
            if (enableLocaleCfgUpdate) {
                writeFileSync(Main.localeCfgFile, locales[args.language] ?? locales.en)
            }
        })

        ipcMain.on('getLanguage', (event) => {
            const rawData = readFileSync(Main.settingsFile, 'utf8')
            const settings = JSON.parse(rawData)
            event.returnValue = settings.language
        })

        ipcMain.on('request-worker-channel', (event) => {
            if (event.senderFrame === Main.mainWindow.webContents.mainFrame) {
                const { port1, port2 } = new MessageChannelMain()
                Main.workerWindow.webContents.postMessage('new-client', { isDev, path: process.env.PORTABLE_EXECUTABLE_DIR }, [port1])
                event.senderFrame.postMessage('provide-worker-channel', null, [port2])
            }
        })

        ipcMain.on('noNetwork', () => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: i18n.t('noConnection'),
                type: 'error',
            })
            Main.application.quit()
        })

        ipcMain.on('errorServer', () => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: i18n.t('errorConnection'),
                type: 'error',
            })
            Main.application.quit()
        })

        ipcMain.on('errorSliderFile', () => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: i18n.t('errorSliderFile'),
                type: 'error',
            })
        })

        ipcMain.on('errorDownloadFile', (_, args) => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: i18n.t('errorDownloadFile', { fileName: args.fileName }),
                type: 'error',
                detail: args.error,
            })
        })
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
        Main.BrowserWindow = browserWindow
        Main.application = app
        Main.application.on('window-all-closed', Main.onWindowAllClosed)
        Main.application.on('ready', Main.onReady)
    }
}
