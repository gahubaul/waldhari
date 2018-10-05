const express = require('express')
const path = require('path')
const multer = require('multer')
const fileUpload = require('express-fileupload');
const upload = multer()
const app = express()
const port = process.env.PORT || 8080;
const DomParser = require('dom-parser');
const fs = require('fs')
const lib = require('./module')



app.use(fileUpload())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', function(req, res) {
    const way = path.join(__dirname, '../views/page.ejs')
    lib.sendFile(req, res, way)
})

app.get('/test', function(req, res) {
    res.send('Vous êtes dans la cave à vins, ces bouteilles sont à moi !')
})

app.get('/home', function(req, res) {
    res.send('Hé ho, c\'est privé ici !')
})

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.')
    let sampleFile = req.files.sampleFile
    console.log(__dirname)
    sampleFile.mv(__dirname + '/Notes-unparsed/' + req.files.sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err)
        lib.sendFile(req, res, '../views/page_parsing_success.ejs')
    })
})

app.get('/read', (req, res) => {

    const file = path.join(__dirname, '../Notes-unparsed/Notes Sapiens.html')
    fs.readFile(file, 'utf8', function(err, html){
        if (!err) {
            const tab = html.match(/noteText'>(.+)</gm)
            const test = tab.map(o => o.match(/>(.+)</gm)[0].match(/[^<>]+/gm)[0])
            let body = ''
            test.map(o => body += `${o}<br>`)



            res.send(body)
        }
    })
})

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/html')
    res.status(404)
    const way = path.join(__dirname, '../views/404_error_template.ejs')
    lib.sendFile(req, res, way)
})

app.listen(port)

