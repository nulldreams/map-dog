// Dependencies
var mongoose = require('mongoose');
var Animal = require('./models/animal.js')
var User = require('./models/user.js')
var Schema = mongoose.Schema
var request = require('request')
var fs = require('fs')
var multer = require('multer')
var notificacao = require('./notificacao.js')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

var upload = multer({
    storage: storage
})

module.exports = (app) => {
    app.get('/animals', estaLogado, function(req, res) {

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Animal.find({});
        query.exec(function(err, animals) {
            if (err) res.json({
                status: 500,
                message: 'Ocorreu um erro, tente novamente.'
            })
            else {
                // If no errors are found, it responds with a JSON of all users
                res.json(animals);
            }
        });
    })

    app.get('/animal/:id', (req, res) => {

        Animal.findById(req.params.id, (err, _animal) => {
            if (err) res.json({
                status: 500,
                message: 'Ocorreu um erro, tente novamente.'
            })

            // res.render('pages/animal', { animal: _animal})
            res.json(_animal)
        })
    })

    app.post('/animal', upload.single('animal'), (req, res, next) => {
        let notificacaoOpts = {
            from: 'Bichinhos',
            to: '',
            subject: 'Um novo bichinho foi adicionado.',
            text: ''
        }


        var newAnimal = Animal({
            tipo: req.body.tipo,
            cor: req.body.cor,
            porte: req.body.porte,
            genero: req.body.genero,
            idade: req.body.idade,
            descricao: req.body.descricao,
            localizacao: [req.body.lng, req.body.lat],
            img: {
                data: req.file.filename
            }
        })

        newAnimal.save((err, animal) => {
            if (err) res.json({
                status: 500,
                message: 'Ocorreu um erro, tente novamente.'
            })

            Animal.findById(animal, (err, doc) => {
                if (err) return next(err)

                User.findById(req.user._id, (err, user) => {
                    for (var i = 0; i < user.local.subscribers.length; i++) {
                        notificacaoOpts.to = user.local.subscribers[i].email
                        notificacaoOpts.html = '<b><h1>Olá ' + user.local.subscribers[i].nome + ', tudo bem?</h1></b><b><h2>Estamos passando para te avisar que adicionamos um novo animal perdido, espero que você possa ajudar ele!!</h2></b> <a href="https://sos-animals.herokuapp.com/animal/' + animal._id + '"><h2>Link para acessar o perfil do bichinho.</h2></a>'
                        notificacao(notificacaoOpts)
                    }
                    res.json({
                        status: 200
                    })
                })
            })
        })
    })

    // route middleware to make sure a user is logged in
    function estaLogado(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
}