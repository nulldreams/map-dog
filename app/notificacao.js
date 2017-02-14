const nodemailer = require('nodemailer')
const User 		 = require('./models/user.js')
const Animal     = require('./models/animal.js')
const randomstring = require('randomstring')
const hat          = require('hat')

module.exports = function(opts) {
  var mailOpts, smtpTransport

  smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'nulldreams@gmail.com',
      pass: '88021963'
    }
  })  

  mailOpts = {
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  }

  smtpTransport.sendMail(mailOpts, (err, response) => {
    console.log('O e-mail foi enviado para ' + mailOpts.to + ', veja sua caixa de entrada :)')
  })

}
/*
module.exports = (app) => {

	let transporter = nodemailer.createTransport({
		service: 'gmail',
    port: 587,
		auth: {
			user: 'nulldreams@gmail.com',
			pass: '88021963'
		}
	})	

	let animalOptions = {
		from: '"Bichinhos" <alterar-senha@bichinhos.com>',
		to: '',
		subject: 'Alteração de senha.',
		text: ''
	}   	

	let recoveryOptions = {
		from: '"Bichinhos" <recuperar-senha@bichinhos.com>',
		to: '',
		subject: 'Recuperação de senha.',
		text: ''
	} 

  var notificar = (id_usuario, id_animal) => {
    User.findById(id_usuario, (err, user) => {
      Animal.findById(id_animal, (err, animal) => {
        for (var i = 0; i < user.local.subscribers; i++) {
          animalOptions.to = user.local.subscribers[i].email
          animalOptions.html = '<b><h1>Olá ' + user.local.subscribers[i].nome + ', tudo bem?</h1></b><b><h2>Estamos passando para te avisar que adicionamos um novo animal perdido, espero que você possa ajudar ele!!</h2></b> <a href="https://sos-animals.herokuapp.com/animal/' + animal._id + '"><h2>Link para alteração de senha.</h2></a>'
          transporter.sendMail(animalOptions, (error, info) => {
            if (error) return console.log(error)
            console.log('O e-mail foi enviado para ' + user.local.subscribers[i].email + ', veja sua caixa de entrada :)')
          })
        }
      })
    })
  }

  exports.notificar = notificar

  app.post('/notificar', (req, res) => {
    console.log('rtafasdas')
    User.findById(req.body.id_usuario, (err, user) => {
      Animal.findById(req.body.id_animal, (err, animal) => {
        for (var i = 0; i < user.local.subscribers; i++) {
          animalOptions.to = user.local.subscribers[i].email
          animalOptions.html = '<b><h1>Olá ' + user.local.subscribers[i].nome + ', tudo bem?</h1></b><b><h2>Estamos passando para te avisar que adicionamos um novo animal perdido, espero que você possa ajudar ele!!</h2></b> <a href="https://sos-animals.herokuapp.com/animal/' + animal._id + '"><h2>Link para alteração de senha.</h2></a>'
          transporter.sendMail(animalOptions, (error, info) => {
            if (error) return console.log(error)
            console.log('O e-mail foi enviado para ' + user.local.subscribers[i].email + ', veja sua caixa de entrada :)')
          })
        }
        console.log('aaa')
      })
    })
  })
 
}*/