const Animal = require('../models/animal.js')
const User = require('../models/user.js')
const _ = require('underscore')

exports.AdicionarEvento = (evento, usuario) => {
    console.log('Evento adicionado ' + usuario)

    evento.on('email-' + usuario, (usuario) => {
        console.log('Evento acionado. ' + usuario)

        User.find({ 'user.local.email': usuario }, (err, user) => {
            _each(user.local.subscribers, )
        })


    })

    evento.emit('email-' + usuario, usuario)

}

var EnviarEmail = (notifiemail) => {
    let notificacaoOpts = {
        from: 'Bichinhos',
        to: '',
        subject: 'Um novo bichinho foi adicionado.',
        text: ''
    }

    notificacaoOpts.to = email
    notificacaoOpts.text = ''

}