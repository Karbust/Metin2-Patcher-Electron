# Metin2-Patcher-Electron
A simple metin2 patcher made in Electron with React and TypeScript.\
The file verification is made with SHA256.

![Patcher Screenshot](https://i.imgur.com/X7dasOc.png)

## Getting Started

Install NodeJS: https://nodejs.org/en/download/ \
Install Yarn: https://yarnpkg.com/getting-started/install

Clone the repository:
```bash
git clone https://github.com/Karbust/Metin2-Patcher-Electron
```
Install the dependencies:

```bash
yarn install
```

Edit `src/config.ts` with your own values.\
Change `resources/icon.png` with your own logo (_should be at least 256x256_).

## Available Commands

| Command | Purpose |
| ------ | ------ |
| yarn run start | Starts the React App (aka Frontend) in development mode. |
| yarn run build | Builds a production ready React bundle. |
| yarn run electron-start | Starts the Electron App. |
| yarn run electron-pack | Builds a production package of the app. |
| yarn run lint | Check for linting errors. |
| yarn run lint-fix | Fixing some linting errors. |

## About the Patcher
This project was made with the intend of learn more about Electron, something I wanted to do for a while.\
If the folders don't exist, they'll be created. If the files don't exist they will be downloaded.\
The patcher checks the local files and if their checksum mismatches the remote checksum, they will get downloaded.\
This patcher runs the downloads **asynchronously**, this means it will download multiple files at the same time.\
The entire project is made in React and Electron both with TypeScript.\
For CSS was used TailwindCSS.

## Deploying

After editing everything you must use the command `yarn run electron-pack` to build the application.\
It will build 2 files inside the `release` folder:
- Metin2 Patcher Electron-X.X.X-win.zip
- metin2_patcher_electron.exe

The first file is the full bundle zipped that can be extracted to the client folder (after removing the 2 unnecessary LINCENSE files). `DON'T USE THIS IF YOU ALREADY HAVE THE CEF BROWSER ON THE CLIENT.`\
The second file is also zipped but will be extract to a temporary folder during runtime (takes about 3 seconds to fully open)  and clean after itself when it closes. `This is the way if you can't perform the first option.`

## Development Testing

In case there isn't the possibility to use a local webserver (like Apache with Xampp, or Wampp) it may be necessary update the CORS on your remote server.

### For NGINX

Go to the configuration file for the patcher host and add this line: 
```
add_header 'Access-Control-Allow-Origin' 'http://localhost:3000';
```

### For Apache

Go to the configuration file for the patcher host and add this line:
```
Header set Access-Control-Allow-Origin "http://localhost:3000"
```

It may also be needed to activate the headers module:
```shell
a2enmod headers
```

## Web Server

Using [this NodeJS script](https://gist.github.com/Karbust/14bbaba7910b72023e0229abf53e8d54), you shall place the client files inside a folder called `files` and run the script.\
It will generate the JSON file with the names, sizes and checksum hash of the files.

![Dir1](https://i.imgur.com/0k1sM3Y.png) \
![Dir2](https://i.imgur.com/CHjlRiF.png)

## Issues

If you encounter any issue, you should open a New Issue.

## License

MIT
