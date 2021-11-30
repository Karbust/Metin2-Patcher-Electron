import { FunctionComponent, useContext, useEffect, useRef } from 'react'
import isOnline from 'is-online'
import { getI18n } from 'react-i18next'

import Titlebar from './components/Titlebar'
import Slider from './components/Slider'
import ProgressBar from './components/ProgressBar'
import Buttons from './components/Buttons'
import { Context } from './reducer/Store'
import { enableSlider, patchlistUrl } from './config'

const { ipcRenderer } = window.require('electron')

ipcRenderer.setMaxListeners(0)

const App: FunctionComponent = () => {
    // @ts-ignore
    const { dispatch } = useContext(Context)
    let globalProgress = 0
    const totalSize = useRef(0)
    const dataJson = useRef([])

    ipcRenderer.once('provide-worker-channel', (eventParent: { ports: [any] }) => {
        const [port] = eventParent.ports
        port.onmessage = ({ data }: { data: any }) => {
            if (data.type === 'fileProgress') {
                dispatch({
                    type: 'SET_FILEPROGRESS',
                    payload: Math.floor((data.progressSize * 100) / data.total_bytes)
                })
                dispatch({
                    type: 'SET_CURRENTFILE',
                    payload: data.currentFile
                })
            } else if (data.type === 'progressSize' || data.type === 'end') {
                globalProgress += data.progressSize
                dispatch({
                    type: 'SET_COMPLETED',
                    payload: Math.floor((globalProgress * 100) / totalSize.current)
                })
            } else if (data.type === 'verifyingFile') {
                dispatch({
                    type: 'SET_ACTION',
                    payload: data.action
                })
            }
        }
        port.postMessage(dataJson.current)
    })

    useEffect(() => {
        (async () => {
            if (!await isOnline()) {
                ipcRenderer.send('noNetwork')
            } else {
                await getI18n().changeLanguage(ipcRenderer.sendSync('getLanguage'))
                fetch(patchlistUrl, { cache: 'no-store' })
                    .then((response) => response.json())
                    .then((result) => {
                        result.forEach((file: { size: number }) => {
                            totalSize.current += file.size
                        })
                        dataJson.current = result

                        ipcRenderer.send('request-worker-channel')
                        ipcRenderer.removeAllListeners('request-worker-channel')
                    })
                    .catch(() => {
                        ipcRenderer.send('errorServer')
                    })
            }
        })()
    }, [dispatch])

    return (
        <div className='h-screen w-screen bg-gray-50'>
            <Titlebar />
            <div className='m-2.5'>
                { enableSlider && <Slider /> }
                <ProgressBar />
                <Buttons />
            </div>
        </div>
    )
}

export default App
