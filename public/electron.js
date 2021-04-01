const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const { access, constants, mkdir, createReadStream, existsSync } = require("fs");
const path = require('path');
const { createHash } = require('crypto');
const isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 900,
        resizable: isDev,
        fullscreenable: isDev,
        //transparent: true,
        frame: isDev,
        useContentSize: isDev,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            //enableRemoteModule: true,
            //preload: path.join(__dirname, '../preload.js')
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);

    mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on("toMain", (event, args) => {
    let totalSize = 0
    let progressSize = 0
    args.forEach((fileData) => {
        const file = `C:\\Users\\Karbust\\Desktop\\testerino\\${fileData.fileName}`

        totalSize += fileData.size

        access(file, constants.F_OK, (err) => {
            //console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
            if (err) {
                if (!existsSync(file.substring(0,file.lastIndexOf("\\")+1))) {
                    mkdir(file.substring(0,file.lastIndexOf("\\")+1), { recursive: true }, (err) => {
                        if (err) throw err;
                    });
                }
                /*writeFile(file, "", { flag: 'wx' }, (err) => {
                    if (err) throw err;
                });*/
                mainWindow.webContents.downloadURL(`http://localhost/files/${fileData.fileName}`);
            } else {
                const hash = createHash('sha256')
                const input = createReadStream(file);
                input.on('readable', () => {
                    const data = input.read()

                    if(data) {
                        hash.update(data)
                    } else {
                        const digest = hash.digest('hex')
                        //console.log(digest)
                        if (digest !== fileData.hash) {
                            //console.log('different')
                            mainWindow.webContents.downloadURL(`http://localhost/files/${fileData.fileName.replace(/\\\\/g, '\\')}`);
                        } else {
                            progressSize += fileData.size
                            mainWindow.webContents.send("fromMainProgressSize", { progressSize });
                        }
                    }
                })
            }
        });
    })

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.
        //item.setSavePath(`${__dirname}\\${path.basename(parsed.pathname)}`);
        /*
        http:\\localhost:81\electron\files\v8_context_snapshot.bin
        http:\\localhost:81\electron\files\bgm\a_rhapsody_of_war.mp3
         */
        const regex = /\\((?!files).)*\\?$/g
        //console.log(`C:\\Users\\Karbust\\Desktop\\testerino${item.getURL().replace(/\//g, '\\').replace(/(%20)/g, ' ').match(regex)}`)
        item.setSavePath(`C:\\Users\\Karbust\\Desktop\\testerino${item.getURL().replace(/\//g, '\\').replace(/(%20)/g, ' ').match(regex)}`);

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed');
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused');
                } else {
                    progressSize += item.getReceivedBytes()
                    //console.log('Received bytes: ', item.getReceivedBytes());
                }
            }
        });
        item.once('done', (event, state) => {
            if (state === 'completed') {
                //console.log('Download successfully');
                mainWindow.webContents.send("fromMainProgressSize", { progressSize });
            } else {
                //console.log('Download failed: ', state);
            }
        });
    });
    mainWindow.webContents.send("fromMainTotalSize", { totalSize });
});
