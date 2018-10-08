const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const lib = require('./server/module')
const app = express()


// SET VIEW TEMPLATE  ===> EJS 
app.set('view engine', 'ejs')

// USE SECTION
app.use(fileUpload())
app.use('/assets', express.static('public'))


// ROUTE WEB SITE
app.get('/', function(req, res) {
    res.render('page')
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
    const src = {'src':[
        'https://i.giphy.com/media/l0HlTHgnDtIhkoZOg/giphy.webp',
        'https://i.giphy.com/media/l0HlSaBOVulBlVOgM/giphy.webp',
        'https://i.giphy.com/media/3o6ZtmsRaGrM46YWaI/giphy.webp',
        'https://i.giphy.com/media/l41m4ODfe8PwHlsUU/giphy.webp'
    ]}
    console.log(src)
    const random = src.src[Math.floor(Math.random() * src.src.length)];
    res.render('404_error_template', { src: random})
})


const port = process.env.PORT || 8080
app.listen(port)