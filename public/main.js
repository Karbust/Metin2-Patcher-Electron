const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        useContentSize: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
}

app.on('ready', createWindow);
