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


exports.GerarTokenMessenger = (req, res) => {
  User.findOne({
    'local.email': req.user.local.email
  }, (err, usuario) => {
    if (err) console.error(err)

    if (usuario.notificacoes.token == '') {
      let id = cryptoRandomString(10)
      usuario.notificacoes.messenger = false
      usuario.notificacoes.token = id

      usuario.save((err, doc) => {
        if (err) console.error(err)

        res.json({
          status: 200,
          message: 'Token gerado com sucesso.',
          token: id
        })
      })
    } else
      res.json({
        status: 400,
        message: 'Este token já foi gerado',
        token: usuario.notificacoes.token
      })
  })
}

exports.ListarAssinaturas = (req, res) => {
  User.find({
    'local.subscribers': {
      $elemMatch: {
        email: req.user.local.email
      }
    }
  }, (err, usuarios) => {

    res.json({
      status: 200,
      result: usuarios
    })
  })
}

exports.AtualizarAssinaturas = (req, res) => {
  AtualizarAssinaturas(req, (assinaturas) => {
    res.json({
      status: 200,
      result: assinaturas
    })
  })
}

var AtualizarAssinaturas = (req, callback) => {
  User.find({
    'local.subscribers': {
      $elemMatch: {
        email: req.user.local.email
      }
    }
  }, (err, usuarios) => {

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
}

exports.AssinarNotificacoes = (req, res) => {
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
}

exports.DesassinarNotificacoes = (req, res) => {
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
}

exports.AlterarPerfil = (req, res) => {
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
}

exports.ExibirPerfil = (req, res) => {
  res.json({
    status: 200,
    result: req.user
  })
}

exports.ListarUsuarios = (req, res) => {
  User.find({}, (err, usuarios) => {
    if (err) res.json({
      status: 500,
      message: 'Ocorreu um erro, tente novamente.'
    })
    res.json(usuarios)
  })
}

exports.ConsultarPerfil = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) res.json({
      status: 500,
      message: 'Ocorreu um erro, tente novamente.'
    })
    res.json(user)
  })
}

exports.estaLogado = (req, res, next) => {
  if (req.isAuthenticated())
    return next()

  res.json({ status: 500, message: 'Efetue o login para continuar!' })
}