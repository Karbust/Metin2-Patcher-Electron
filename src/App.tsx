// @ts-nocheck
import { FunctionComponent, useEffect, useContext, useState } from 'react'

import logo from './logo.svg'
import './App.css'
import ProgressBar from './ProgressBar'
import { Context } from './Store'

const { ipcRenderer } = window.require('electron')

let progressSize = 0
let totalSize = 0
let completed = 0

ipcRenderer.on('fromMainProgressSize', (event: any, data: any) => {
    const [state, dispatch] = useContext(Context)
    progressSize += data.progressSize
    console.log(progressSize)
    completed = Math.floor((progressSize * 100) / totalSize)
    dispatch({ type: 'SET_COMPLETED', payload: Math.floor((progressSize * 100) / totalSize) })
    //ipcRenderer.removeAllListeners('fromMainProgressSize')
})
ipcRenderer.once('fromMainTotalSize', (event: any, data: any) => {
    totalSize = data.totalSize
    ipcRenderer.removeAllListeners('fromMainTotalSize')
})

const App: FunctionComponent = () => {
    const [state, dispatch] = useContext(Context)
    const [completedPercentage, setCompletedPercentage] = useState(completed)
    useEffect(() => {
        fetch('http://localhost/files.json', { cache: 'no-store' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                ipcRenderer.send('toMain', data)
                ipcRenderer.removeAllListeners('toMain')
            })
    }, [])

    console.log(state.completed)

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
                <ProgressBar bgColor='#6a1b9a' completed={completedPercentage} />
            </header>
        </div>
    )
}

export default App
