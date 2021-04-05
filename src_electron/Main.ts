import { spawn } from 'child_process'

import * as isDev from 'electron-is-dev'
import { BrowserWindow, ipcMain, dialog, MessageChannelMain } from 'electron'

import {
    binaryName, configName, debugFolder, launchParameters, serverName
} from '../src/config'

export default class Main {
    static mainWindow: Electron.BrowserWindow

    static workerWindow: Electron.BrowserWindow

    static application: Electron.App

    static BrowserWindow: any

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
            height: 200,
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
            }).catch((err) => {
                console.log(err)
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
                message: 'There\'s no network connection.',
                type: 'error',
            })
            Main.application.quit()
        })

        ipcMain.on('errorServer', () => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: 'There was an error connecting to the server.',
                type: 'error',
            })
            Main.application.quit()
        })

        ipcMain.on('errorDownloadFile', (_, args) => {
            dialog.showMessageBoxSync(Main.mainWindow, {
                title: serverName,
                message: `An error occurred while downloading ${args.fileName}.`,
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
