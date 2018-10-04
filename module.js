
const fs = require('fs')

exports.sendFile = (req, res, path) => {
    console.log(__dirname + path)
    const newPath = __dirname + path
    fs.readFile(newPath, (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(data)
        res.end()
    })
    console.log('after')
}