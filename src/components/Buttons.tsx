import { FunctionComponent, useContext } from 'react'

import { Context } from '../reducer/Store'

const { ipcRenderer } = window.require('electron')

const Buttons: FunctionComponent = () => {
    // @ts-ignore
    const { state } = useContext(Context)
    const launchConfig = () => ipcRenderer.send('launchConfig')
    const launchClient = () => ipcRenderer.send('launchClient')

    return (
        <div className='relative'>
            <div className='absolute right-0'>
                <button
                    className='disabled:opacity-50 mr-3 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={launchConfig}
                    disabled={state.completed !== 100}
                >
                    Settings
                </button>
                <button
                    className='disabled:opacity-50 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={launchClient}
                    disabled={state.completed !== 100}
                >
                    Play
                </button>
            </div>
        </div>
    )
}
export default Buttons
