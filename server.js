const express = require('express')
const multer = require('multer')
const fileUpload = require('express-fileupload');
const upload = multer()
const app = express()
const port = process.env.PORT || 8080;


function generateHTML (res) {
    const titi = {
        status: '',
        error: '',
        successs: ''
    }

    if (res === 'salut')
    {
        titi.status = 200
        titi.successs = 'Tout a fonctionné'
        titi.error = null
    } else {
        titi.status = 404
        titi.successs = null
        titi.error = 'DATA NOT FOUND'
    }
    return (titi)
}

app.use(fileUpload())
app.use(express.static(__dirname + '/public'))

app.all('*', (req, res) => {
    const path = req.params["0"]
    const query = req.query

    switch (path) {
        case '/':
            console.log('main page') // ajouter app use pour dire ou se trouve les static de la page. Ici on vas chercher dans le dossier public
            res.render('page.ejs')
            break;
         case '/test':
            const toto = generateHTML(query.var1)
            res.send(toto)
            break;
        case '/upload':
            if (!req.files)
                return res.status(400).send('No files were uploaded.')
            let sampleFile = req.files.sampleFile
            sampleFile.mv(__dirname + '/Notes-unparsed/' + req.files.sampleFile.name, function(err) {
                if (err)
                return res.status(500).send(err)
                res.send('File uploaded!')
            })
            break
        default:
            console.log('page not found')
            res.render('404_error_template.ejs')
            break;
    }
})

app.listen(port)