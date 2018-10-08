const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const lib = require('./server/module')
const app = express()
const port = process.env.PORT || 8080


// SET VIEW TEMPLATE  ===> EJS 
app.set('view engine', 'ejs')

// USE SECTION
app.use(fileUpload())
app.use('/assets', express.static('public'))


// ROUTE WEB SITE
app.get('/', function(req, res) {
    const way = path.join(__dirname, 'views/page.ejs')
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
    const file = __dirname + '/Notes-unparsed/' + req.files.sampleFile.name
    sampleFile.mv(file, function(err) { if (err) { return res.status(500).send(err) }})
    fs.readFile(file, 'utf8', function(err, html){
        if (!err) {
            const tab = html.match(/noteText'>(.+)</gm)
            const test = tab.map(o => o.match(/>(.+)</gm)[0].match(/[^<>]+/gm)[0])
            let vocabulary = []
            let quotes = []
            test.map(o => (o.split(' ').length > 6) ? quotes.push(o): vocabulary.push(o))
            
            let body = '<br><br>Vocabulary<br><br>'
            vocabulary.map(o => body += `${o}<br>`)
            body += '<br><br>Quotes<br><br>'
            quotes.map(o => body += `${o}<br>`)
            res.send(body)
        }
    })
    fs.unlinkSync(file);
})

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/html')
    res.status(404)
    const way = path.join(__dirname, 'views/404_error_template.ejs')
    lib.sendFile(req, res, way)
})

app.listen(port)

