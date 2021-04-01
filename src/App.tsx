import { FunctionComponent, useEffect, useState } from 'react'

import logo from './logo.svg'
import './App.css'
import ProgressBar from './ProgressBar'

const { ipcRenderer } = window.require('electron')

let progressSize = 0
let totalSize = 0
let completed = 0

ipcRenderer.on('fromMainProgressSize', (event: any, data: any) => {
    progressSize += data.progressSize
    console.log(progressSize)
    completed = Math.floor((progressSize * 100) / totalSize)
    //ipcRenderer.removeAllListeners('fromMainProgressSize')
})
ipcRenderer.once('fromMainTotalSize', (event: any, data: any) => {
    totalSize = data.totalSize
    ipcRenderer.removeAllListeners('fromMainTotalSize')
})

const App: FunctionComponent = () => {
    const [completedPercentage, setCompletedPercentage] = useState(completed)
    useEffect(() => {
        fetch('http://localhost:81/electron/files.json', { cache: 'no-store' })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                ipcRenderer.send('toMain', data)
                ipcRenderer.removeAllListeners('toMain')
            })
    }, [])

    console.log(completedPercentage)

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
