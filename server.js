const express = require('express')
const multer = require('multer')
const fileUpload = require('express-fileupload');
const upload = multer()
const app = express()
const port = process.env.PORT || 8080;
const DomParser = require('dom-parser');
// const parser = new DomParser();
const fs = require('fs')
const lib = require(__dirname + '/module.js')



app.use(fileUpload())
app.use('/public', express.static(__dirname + '/public')) // static CSS
app.use(express.static(__dirname + '/views')) // static HTML

console.log(__dirname + '/views')
console.log(__dirname + '/public')

app.get('/', function(req, res) {
    // res.render('page.ejs')
    
    lib.sendFile(req, res, '/views/page.ejs')
})

app.get('/test', function(req, res) {
    res.send('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
})

app.get('/home', function(req, res) {
    res.send('Hé ho, c\'est privé ici !');
})

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.')
    let sampleFile = req.files.sampleFile
    console.log(__dirname)
    sampleFile.mv(__dirname + '/Notes-unparsed/' + req.files.sampleFile.name, function(err) {
        if (err)
            return res.status(500).send(err)
        lib.sendFile(req, res, '/views/page_parsing_success.ejs')
    })
})

app.get('/read', (req, res) => {
    fs.readFile(__dirname + '/Notes-unparsed/Notes Sapiens.html', 'utf8', function(err, html){
        if (!err) {
            const tab = html.match(/noteText'>(.+)</gm)
            const test = tab.map(o => o.match(/>(.+)</gm)[0].match(/[^<>]+/gm)[0])
            let body = ''
            test.forEach(element => {
                body += `${element}<br>`
            })
            res.send(body)
        }
    })
})

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/html')
    res.status(404)
    lib.sendFile(req, res, '/views/404_error_template.ejs')
})

app.listen(port)