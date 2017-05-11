const nodemailer    = require('nodemailer')
const User          = require('./models/user.js')
const randomstring  = require('randomstring')
const hat           = require('hat')

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

exports.AlterarSenha = (req, res) => {
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
}

exports.EmailAlterarSenha = (req, res) => {
  var id = hat()

  User.findOne({
    'local.email': req.body.email
  }, (err, user) => {
    if (err) res.json({
      status: 404,
      message: 'Nenhum usuário encontrado!'
    })

    user.local.token_recovery = id
    changeOptions.to = user.local.email
    changeOptions.html = '<b><h1>Olá ' + user.local.name + ', tudo bem?</h1></b><p>Então você quer alterar a senha? Se desconficar que alguém está tentando invadir sua conta, nos informe! <br>Até mais.</p><a href="https://sos-animals.herokuapp.com/pass-change/' + id + '"><h2>Link para alteração de senha.</h2></a>' // html body

    user.save((err, doc) => {
      transporter.sendMail(changeOptions, (error, info) => {
        if (error) return console.log(error)
        console.log('Message %s sent: %s', info.messageId, info.response)
        res.json({
          status: 200,
          message: 'O e-mail foi enviado para ' + req.body.email + ', veja sua caixa de entrada :)'
        })
      })
    })
  })
}

exports.EmailRecuperarSenha = (req, res) => {
  var newPass = randomstring.generate(7)
  User.findOne({
    'local.email': req.body.email
  }, (err, user) => {
    if (err) res.json({
      status: 404,
      message: 'Nenhum usuário encontrado!'
    })

    user.local.password = user.generateHash(newPass)
    recoveryOptions.to = user.local.email
    recoveryOptions.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE"><title>Template Base</title><style id="media-query">/* Client-specific Styles & Reset */ #outlook a { padding: 0; } /* .ExternalClass applies to Outlook.com (the artist formerly known as Hotmail) */ .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } #backgroundTable { margin: 0; padding: 0; width: 100% !important; line-height: 100% !important; } /* Buttons */ .button a { display: inline-block; text-decoration: none; -webkit-text-size-adjust: none; text-align: center; } .button a div { text-align: center !important; } /* Outlook First */ body.outlook p { display: inline !important; } a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } /*  Media Queries */ @media only screen and (max-width: 500px) { table[class="body"] img { height: auto !important; width: 100% !important; } table[class="body"] img.fullwidth { max-width: 100% !important; } table[class="body"] center { min-width: 0 !important; } table[class="body"] .container { width: 95% !important; } table[class="body"] .row { width: 100% !important; display: block !important; } table[class="body"] .wrapper { display: block !important; padding-right: 0 !important; } table[class="body"] .columns, table[class="body"] .column { table-layout: fixed !important; float: none !important; width: 100% !important; padding-right: 0px !important; padding-left: 0px !important; display: block !important; } table[class="body"] .wrapper.first .columns, table[class="body"] .wrapper.first .column { display: table !important; } table[class="body"] table.columns td, table[class="body"] table.column td, .col { width: 100% !important; } table[class="body"] table.columns td.expander { width: 1px !important; } table[class="body"] .right-text-pad, table[class="body"] .text-pad-right { padding-left: 10px !important; } table[class="body"] .left-text-pad, table[class="body"] .text-pad-left { padding-right: 10px !important; } table[class="body"] .hide-for-small, table[class="body"] .show-for-desktop { display: none !important; } table[class="body"] .show-for-small, table[class="body"] .hide-for-desktop { display: inherit !important; } .mixed-two-up .col { width: 100% !important; } }  @media screen and (max-width: 500px) { div[class="col"] { width: 100% !important; } } @media screen and (min-width: 501px) { table[class="container"] { width: 500px !important; } }</style></head><body style="width: 100% !important;min-width: 100%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100% !important;margin: 0;padding: 0;background-color: #FFFFFF"><table cellpadding="0" cellspacing="0" width="100%" class="body" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;height: 100%;width: 100%;table-layout: fixed"><tbody><tr style="vertical-align: top"><td class="center" align="center" valign="top" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;text-align: center;background-color: #FFFFFF"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #000000;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 5px;padding-right: 0px;padding-bottom: 5px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table cellpadding="0" cellspacing="0" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td align="center" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;width: 100%"><div align="center" style="font-size:12px"><img class="center fullwidth" align="center" border="0" src="https://www.doylestownveterinaryhospital.com/wp-content/uploads/2014/07/lost-dog_2.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: 0;height: auto;line-height: 100%;margin: 0 auto;float: none;width: 100% !important;max-width: 500px" width="500"></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent"><!--[if gte mso 9]><table id="outlookholder" border="0" cellspacing="0" cellpadding="0" align="center"><tr><td><![endif]--><!--[if (IE)]><table width="500" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]--><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" class="container" style="border-spacing: 0;border-collapse: collapse;vertical-align: top;max-width: 500px;margin: 0 auto;text-align: inherit"><tbody><tr style="vertical-align: top"><td width="100%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><table cellpadding="0" cellspacing="0" width="100%" bgcolor="transparent" class="block-grid " style="border-spacing: 0;border-collapse: collapse;vertical-align: top;width: 100%;max-width: 500px;color: #000000;background-color: transparent"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;text-align: center;font-size: 0"><!--[if (gte mso 9)|(IE)]><table width="100%" align="center" bgcolor="transparent" cellpadding="0" cellspacing="0" border="0"><tr><![endif]--><!--[if (gte mso 9)|(IE)]><td valign="top" width="500" style="width:500px;"><![endif]--><div class="col num12" style="display: inline-block;vertical-align: top;width: 100%"><table cellpadding="0" cellspacing="0" align="center" width="100%" border="0" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;background-color: transparent;padding-top: 5px;padding-right: 0px;padding-bottom: 5px;padding-left: 0px;border-top: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-left: 0px solid transparent"><table cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;border-collapse: collapse;vertical-align: top"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-top: 10px;padding-right: 10px;padding-bottom: 10px;padding-left: 10px"><div style="color:#555555;line-height:150%;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><div style="font-size:12px;line-height:18px;color:#555555;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: left"><span style="font-size: 16px; line-height: 24px;">Olá, ' + user.local.name + '</span><br></p><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: left"><span style="font-size: 16px; line-height: 24px;">&nbsp;</span><br></p><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: left"><span style="font-size: 16px; line-height: 24px;">Então você perdeu sua senha? Fique tranquilo, nós geramos uma nova senha para você, ela é ' + newPass + '</span></p></div></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if (gte mso 9)|(IE)]></td><![endif]--><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table><!--[if mso]></td></tr></table><![endif]--><!--[if (IE)]></td></tr></table><![endif]--></td></tr></tbody></table></td></tr></tbody></table></body></html>'

    user.save((err, doc) => {
      transporter.sendMail(recoveryOptions, (error, info) => {
        if (error) return console.log(error)
        console.log('Message %s sent: %s', info.messageId, info.response)
        res.json({
          status: 200,
          message: 'O e-mail foi enviado para ' + req.body.email + ', veja sua caixa de entrada :)'
        })
      })
    })
  })
}


/*module.exports = (app) => {
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

  })
}*/