const http = require('http')
const { createWriteStream } = require('fs')
const { parentPort } = require('worker_threads')

const downloadFile = (configuration) => new Promise((resolve, reject) => {
    http.get(configuration.remoteFile, (response) => {
        const { statusCode } = response
        let error

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

        response.on('data', (chunk) => {
            //this.process.send(`File ${chunk.length}`)
        })

        response.on('end', () => {
            resolve()
        })
    })
})

parentPort.on('message', (message) => {
    if (message.type === 'downloadFile') {
        downloadFile(message.value)
            .then(() => {
                parentPort.postMessage('')
            })
            .catch((err) => {
                parentPort.postMessage(err)
            })
    }
})
