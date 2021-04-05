import * as http from 'http'
import * as https from 'https'
import { createHash } from 'crypto'
import {
    access, constants, createReadStream, createWriteStream, existsSync
} from 'fs'

import * as mkdirp from 'mkdirp'

import { debugFolder, patchlistFolder } from '../src/config'

const { ipcRenderer } = window.require('electron')

if (typeof Array.prototype.delayedForEach !== 'function') {
    // eslint-disable-next-line func-names,no-extend-native
    Array.prototype.delayedForEach = function (callback, timeout, thisArg) {
        if (!this) {
            return
        }
        let i = 0
        const l = this.length
        const caller = () => {
            callback.call(thisArg || this, this[i], i, this)
            if (++i < l) {
                setTimeout(caller, timeout)
            }
        }
        caller()
    }
}

interface downloadFileProps {
    remoteFile: string
    localFile: string
    fileName: string
    port: MessagePort
}

interface fileDataType {
    fileName: string
    size: number
    hash: string
}

const adapterFor = (() => {
    const adapters: Record<string, any> = {
        'http:': http,
        'https:': https
    }
    return (inputUrl: string) => adapters[new URL(inputUrl).protocol]
})()

const downloadFile = (configuration: downloadFileProps) => new Promise((resolve, reject) => {
    adapterFor(configuration.remoteFile).get(configuration.remoteFile, (response: { resume?: any; pipe?: any; headers?: any; on?: any; statusCode?: any }) => {
        const { statusCode } = response
        let error
        let progressSize = 0
        let total_bytes = 0

        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`)
        }

        if (error) {
            response.resume()
            reject(error.message)
            return
        }

        response.pipe(createWriteStream(configuration.localFile))

        total_bytes = parseInt(response.headers['content-length'], 10)

        response.on('data', (chunk: string | any[]) => {
            progressSize += chunk.length
            configuration.port.postMessage({
                type: 'fileProgress',
                currentFile: configuration.fileName,
                action: `Downloading ${configuration.fileName}`,
                progressSize,
                total_bytes
            })
        })

        response.on('end', () => {
            configuration.port.postMessage({
                type: 'end',
                progressSize
            })
            resolve('')
        })
    })
})

ipcRenderer.on('new-client', (eventParent, args) => {
    const [port] = eventParent.ports
    const { isDev, path } = args
    port.onmessage = (event) => {
        event.data.delayedForEach((fileData: fileDataType) => {
            const fileName = fileData.fileName.replace(/\//g, '\\').replace(/(%20)/g, ' ')
            const remoteFile = `${patchlistFolder}${fileData.fileName}`.replace(/\\/g, '\/')
            const localFile = `${isDev ? debugFolder : path}\\${fileData.fileName.replace(/\//g, '\\').replace(/(%20)/g, ' ')}`

            access(localFile, constants.F_OK, (err) => {
                port.postMessage({ type: 'verifyingFile', action: `Verifying ${fileName}` })
                if (err) {
                    const directory = localFile.substring(0, localFile.lastIndexOf('\\') + 1)
                    if (!existsSync(directory)) {
                        mkdirp.sync(directory)
                    }
                    downloadFile({
                        fileName: fileData.fileName.replace(/\//g, '\\').replace(/(%20)/g, ' '),
                        remoteFile,
                        localFile,
                        port
                    }).catch((error) => {
                        ipcRenderer.send('errorDownloadFile', { fileName, error })
                    })
                } else {
                    const hash = createHash('sha256')
                    const input = createReadStream(localFile)
                    input.on('readable', () => {
                        const data = input.read()
                        if (data) {
                            hash.update(data)
                        } else {
                            const digest = hash.digest('hex')
                            if (digest !== fileData.hash) {
                                downloadFile({
                                    fileName,
                                    remoteFile,
                                    localFile,
                                    port
                                }).catch((error) => {
                                    ipcRenderer.send('errorDownloadFile', { fileName, error })
                                })
                            } else {
                                port.postMessage({ type: 'progressSize', progressSize: fileData.size })
                            }
                        }
                    })
                }
            })
        }, 0)
    }
})
