const nodemailer = require('nodemailer')
const User 		 = require('./models/user.js')
const randomstring = require('randomstring')
const hat          = require('hat')

module.exports = (app) => {

	let transporter = nodemailer.createTransport({
		service: 'gmail',
    port: 587,
		auth: {
			user: 'nulldreams@gmail.com',
			pass: '88021963'
		}
	})	

	let changeOptions = {
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

  app.get('/pass-change/:token', (req, res) => {

  	User.findOne({ 'local.token_recovery' : req.params.token }, (err, user) => {
    	if (err) res.json({ status: 404, message: 'Nenhum usuário encontrado!' })

	    	res.render('pages/change', { token : req.params.token })
  	})
  })

  app.get('/pass-recovery', (req, res) => {
    res.render('pages/mail-recovery')
  })
  app.get('/pass-change', (req, res) => {
    res.render('pages/mail-change')
  })

  app.post('/pass-change/:token', (req, res) => {
  	console.log('asdasd')
  	User.findOne({ 'local.token_recovery' : req.params.token }, (err, user) => {
    	if (err) res.json({ status: 404, message: 'Nenhum usuário encontrado!' })

    	  if (req.params.token !== user.local.token_recovery) res.json({ status: 400, message: 'A alteração de senha não foi solicitada para esta conta.' })
    	  	
    	  if (user.validPassword(req.body.senha_atual)) {
    	  	  user.local.password = user.generateHash(req.body.senha_nova)
    	  	  user.local.token_recovery = ''

    	  	  user.save((err, doc) => {
    	  	  	if (err) res.json(err)

    	  	  	res.json({ status: 200, message: 'Senha alterada com sucesso!' })
    	  	  })
    	  } else res.json({ status: 400, message: 'Senha atual incorreta.' })

  	})
  })

  app.post('/mail-pass-change/', (req, res) => {
  	var id = hat()

    User.findOne({ 'local.email' : req.body.email }, (err, user) => {
    	if (err) res.json({ status: 404, message: 'Nenhum usuário encontrado!' })
 		
 		user.local.token_recovery = id
    	changeOptions.to = user.local.email
    	changeOptions.html = '<b><h1>Olá ' + user.local.name + ', tudo bem?</h1></b><p>Então você quer alterar a senha? Se desconficar que alguém está tentando invadir sua conta, nos informe! <br>Até mais.</p><a href="https://sos-animals.herokuapp.com/pass-change/' + id + '"><h2>Link para alteração de senha.</h2></a>' // html body

    	user.save((err, doc) => {
			transporter.sendMail(changeOptions, (error, info) => {
				if (error) return console.log(error)
				console.log('Message %s sent: %s', info.messageId, info.response)
			    res.json({ status: 200, message: 'O e-mail foi enviado para ' + req.body.email + ', veja sua caixa de entrada :)' })
			})	
    	})	
    })
  })	

  app.post('/mail-pass-recovery', (req, res) => {
  	var newPass = randomstring.generate(7)
    User.findOne({ 'local.email' : req.body.email }, (err, user) => {
    	if (err) res.json({ status: 404, message: 'Nenhum usuário encontrado!' })
 		
 		user.local.password = user.generateHash(newPass)
    	recoveryOptions.to = user.local.email
    	recoveryOptions.html = '<b><h1>Olá ' + user.local.name + ', tudo bem?</h1></b><p>Notamos que você esqueceu sua senha haha, enviamos uma nova para você! <br>Até mais.</p><b><h2>Sua senha: ' + newPass + '</h2></b>' // html body

    	user.save((err, doc) => {
			transporter.sendMail(recoveryOptions, (error, info) => {
				if (error) return console.log(error)
				console.log('Message %s sent: %s', info.messageId, info.response)
			    res.json({ status: 200, message: 'O e-mail foi enviado para ' + req.body.email + ', veja sua caixa de entrada :)' })
			})	
    	})	
    })
  })
}