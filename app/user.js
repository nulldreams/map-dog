// Dependencies
const mongoose = require('mongoose');
const Animal = require('./models/animal.js')

const User = require('./models/user.js')
const Schema = mongoose.Schema
const fs = require('fs')
const multer = require('multer')
const cryptoRandomString = require('crypto-random-string');

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

  var FindValue = (obj, key, value) => {
    for (var i = 0; i < Object.keys(obj).length; i++) {
      if (obj[i][key] == value) {
        return i
      }
    }
    return null
  }

  app.get('/token-messenger', estaLogado, (req, res) => {
    User.findOne({ 'local.email': req.user.local.email }, (err, usuario) => {
      if (err) console.error(err)

      if (usuario.notificacoes.token == '') {
        let id = cryptoRandomString(10)
        usuario.notificacoes.messenger = false
        usuario.notificacoes.token = id

        usuario.save((err, doc) => {
          if (err) console.error(err)

          res.json({ status: 200, message: 'Token gerado com sucesso.', token: id })
        })        
      }
      else
        res.json({ status: 400, message: 'Este token já foi gerado', token: usuario.notificacoes.token })
    })
  })

  app.get('/todas-assinaturas', estaLogado, (req, res) => {
      User.find({ 'local.subscribers': { $elemMatch : { email: req.user.local.email } } }, (err, usuarios) => {
         
         res.json({ status: 200, message: usuarios })
      })
  })

  app.post('/atualizar-assinaturas', estaLogado, (req, res) => {
      AtualizarAssinaturas(req, (result) => {
        res.json({ status: 200, message: result })
      })
  })

  var AtualizarAssinaturas = (req, callback) => {
    User.find({ 'local.subscribers' : { $elemMatch: { email: req.user.local.email } } }, (err, usuarios) => {
      
      if (err) console.error(err)

      if (usuarios.length > 0) {
        for (var i = 0; i < usuarios.length; i++) {
          let index = FindValue(usuarios[i].local.subscribers, 'email', req.user.local.email)
          usuarios[i].local.subscribers[index].usuario_fb = req.user.local.usuario_fb

          usuarios[i].save((err, doc) => {
            console.log('ok')
          })
        }
      }

      callback(usuarios)
    })

    /*User.update({'subscribers.email': req.user.local.email }, { $set: { 'subscribers.$.usuario_fb': req.user.local.usuario_fb }}, (err, result) => {
    })*/
  }

  app.post('/subscribe/:id', estaLogado, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (user !== null) {
        if (err) res.json({
          status: 500,
          message: 'Ocorreu um erro, tente novamente.'
        })

        user.local.subscribers.push({
          email: req.user.local.email,
          nome: req.user.local.name
        })

        user.save((err, doc) => {
          if (err) res.json({
            status: 500,
            message: 'Ocorreu um erro, tente novamente.'
          })

          res.json({
            status: 200,
            message: 'success'
          })
        })
      } else res.json({
        status: 500,
        message: 'O usuário ou ONG não existe'
      })
    })
  })

  app.post('/unsubscribe/:id', estaLogado, (req, res) => {
    var id
    User.findOne({
      '_id': req.params.id
    }, (err, user) => {
      if (user !== null) {
        if (err) res.json({
          status: 500,
          message: 'Ocorreu um erro, tente novamente.'
        })
        id = user.local.subscribers[FindValue(user.local.subscribers, 'email', req.user.local.email)]._id
        if (typeof id !== undefined) {
          user.local.subscribers.remove(id)
          user.save()
          res.json({
            status: 200,
            message: 'success'
          })
        }
      } else res.json({
        status: 500,
        message: 'O usuário ou ONG não existe'
      })
    })
  })

  app.get('/me/change', estaLogado, (req, res) => {
    // TODO Definir nome da pagina que terá as alterações do perfil
  })

  app.put('/me/change', estaLogado, (req, res) => {
    User.findOne({
      'local.email': req.user.local.email
    }, (err, user) => {
      if (err) res.json({
        status: 500,
        message: 'Ocorreu um erro, tente novamente.'
      })
      if (err) res.json(err)

      user.name = req.body.name
      user.email = req.body.email

      user.save((err) => {
        if (err) res.json({
          status: 500,
          message: 'Ocorreu um erro, tente novamente.'
        })

        res.json({
          status: 200,
          message: 'Usuário alterado com sucesso.'
        })
      })
    })
  })

  app.get('/me', estaLogado, (req, res) => {

    res.render('pages/profile', {
      user: req.user
    })
  })

  app.get('/profiles', (req, res) => {

    User.find({}, (err, usuarios) => {
      if (err) res.json({
        status: 500,
        message: 'Ocorreu um erro, tente novamente.'
      })
      res.json(usuarios)
    })
  })

  app.get('/profile/:id', (req, res) => {

    User.findById(req.params.id, (err, user) => {
      if (err) res.json({
        status: 500,
        message: 'Ocorreu um erro, tente novamente.'
      })
      res.json(user)
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