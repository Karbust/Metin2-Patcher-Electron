// @ts-nocheck
import { FunctionComponent, useEffect, useContext, useState } from 'react'

import logo from './logo.svg'
import './App.css'
import ProgressBar from './ProgressBar'
import { Context } from './Store'

const { ipcRenderer } = window.require('electron')

let progressSize = 0
let totalSize = 0

const App: FunctionComponent = () => {
    const [state, dispatch] = useContext(Context)

    ipcRenderer.on('fromMainProgressSize', (event: any, data: any) => {
        progressSize += data.progressSize
        console.log(progressSize)
        dispatch({ type: 'SET_COMPLETED', payload: Math.floor((progressSize * 100) / totalSize) })
        //ipcRenderer.removeAllListeners('fromMainProgressSize')
    })
    ipcRenderer.once('fromMainTotalSize', (event: any, data: any) => {
        totalSize = data.totalSize
        ipcRenderer.removeAllListeners('fromMainTotalSize')
    })

    useEffect(() => {
        fetch('http://localhost/files.json', { cache: 'no-store' })
            .then((response) => response.json())
            .then((data) => {
                ipcRenderer.send('toMain', data)
                ipcRenderer.removeAllListeners('toMain')
            })
    }, [])

    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>
                    Edit
                    {' '}
                    <code>src/App.tsx</code>
                    {' '}
                    and save to reload.
                </p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>
                <ProgressBar bgColor='#6a1b9a' completed={state.completed} />
            </header>
        </div>
    )
}

export default App
