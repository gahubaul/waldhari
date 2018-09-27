const express = require('express')
const multer = require('multer')
const fileUpload = require('express-fileupload');
const upload = multer()
const app = express()
const port = process.env.PORT || 8080;
const DomParser = require('dom-parser');
// const parser = new DomParser();
const fs = require('file-system')



app.use(fileUpload())
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
    console.log(__dirname)
    console.log(__dirname + '/public')
    res.setHeader('Content-Type', 'text/html') // ajouter app use pour dire ou se trouve les static de la page. Ici on vas chercher dans le dossier public
    res.render('page.ejs')
});

app.get('/test', function(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.send('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
});

app.get('/home', function(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.send('Hé ho, c\'est privé ici !');
});

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.')
    let sampleFile = req.files.sampleFile
    console.log(__dirname)
    sampleFile.mv(__dirname + '/Notes-unparsed/' + req.files.sampleFile.name, function(err) {
        console.log({err})
        res.setHeader('Content-Type', 'text/html')
        if (err)
            return res.status(500).send(err)
        res.render('page_upload.ejs')
    })
})

app.get('/read', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    fs.readFile(__dirname + '/Notes-unparsed/' + 'Notes Sapiens.html', 'utf8', function(err, html){
        if (!err) {
            // const dom = parser.parseFromString(html, 'text/html');
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
    res.status(404).send('Page introuvable !');
});

app.listen(port);