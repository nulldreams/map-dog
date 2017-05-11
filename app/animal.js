// Dependencies
const mongoose = require('mongoose');
const User = require('./models/user.js')
//const Notificacao = require('./models/notificacao.js')
const Animal = require('./models/animal.js')
const Schema = mongoose.Schema
const request = require('request')
const fs = require('fs')
const multer = require('multer')
const notificacao = require('./notificacao.js')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

var upload = multer({
    storage: storage
})

//GET /animais
exports.ConsultarAnimais = (req, res) => {

    // Uses Mongoose schema to run the search (empty conditions)
    var query = Animal.find({});
    query.exec(function (err, animals) {
        if (err) res.json({
            status: 500,
            message: 'Ocorreu um erro, tente novamente.'
        })
        else {
            // If no errors are found, it responds with a JSON of all users
            res.json(animals);
        }
    })
}

//GET /animal/:id
exports.ConsultarAnimal = (req, res) => {
    Animal.findById(req.params.id, (err, _animal) => {
        if (err) res.json({
            status: 500,
            message: err
        })

        // res.render('pages/animal', { animal: _animal})
        res.json(_animal)
    })
}

//POST /animal
exports.AdicionarAnimal = (req, res, next) => {

    console.log(req.body.animal)

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
            message: err
        })

        Animal.findById(animal, (err, animal) => {
            if (err) return next(err)
            console.log('Animal', animal)
            User.findById(req.user._id, (err, user) => {

                notificacao.AdicionarNotificacaoEmail(animal, user.local.email, (success) => {
                    console.log(success)
                    if (success) return res.json({ status: 200 })

                    return res.json({ status: 500, message: 'Ocorreu um erro no upload, por gentileza tente novamente :)' })
                })

            })
        })
    })
}

// route middleware to make sure a user is logged in
exports.estaLogado = (req, res, next) => {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}