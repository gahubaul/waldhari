
const fs = require('fs')

exports.sendFile = (req, res, path) => {
    fs.readFile(path, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(data)
        res.end()
    })
}