// Dependencies
const mongoose        = require('mongoose');
const Animais         = require('./animal.js')
const Autenticacao    = require('./autenticacao.js')
const Mapa            = require('./mapa.js')
const Mail            = require('./mail.js')
const Usuario         = require('./user.js')
const Animal          = require('./models/animal.js')
const User            = require('./models/user.js')
const Schema          = mongoose.Schema
const fs              = require('fs')
const multer          = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

const upload = multer({
    storage: storage
})

module.exports = (app, passport) => {

var emailTeste = (parametro) => {
    console.log('Email de teste' + ' ' + parametro) 
}
app.get('/vamos/:nome', (req, res) => {
    emitirEvento.on('evento' + req.params.nome, emailTeste)
    res.send('evento' + req.params.nome)
})

app.get('/bora/:nome', (req, res) => {
    emitirEvento.emit('evento' + req.params.nome, 'top')
    res.send('evento' + req.params.nome)
})


// --------- ANIMAIS
    app.get('/animals',    Animais.estaLogado, Animais.ConsultarAnimais)
    app.get('/animal/:id', Animais.estaLogado, Animais.ConsultarAnimal)
    app.post('/animal',    Animais.estaLogado, upload.single('animal'), Animais.AdicionarAnimal)


// --------- AUTENTICACAO
    app.post('/signup', passport.authenticate('local-signup', { failureRedirect : '/signup' }), Autenticacao.CriarConta)
    app.post('/login',  passport.authenticate('local-login', { failureRedirect : '/mapa' }),   Autenticacao.RealizarLogin)
    app.get('/',        Autenticacao.redirecionarUsuario,                                       Autenticacao.PaginaInicial)


  // ------- AUTENTICACAO FACEBOOK
    app.get('/auth/facebook',           passport.authenticate('facebook', { scope: 'email' }));
    app.post('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect : '/login' }), Autenticacao.CallbackFacebook)
    app.get('/logout',                  Autenticacao.redirecionarUsuario, Autenticacao.Deslogar)


// --------- EMAIL
    app.get('/pass-change/:token',     Mail.AlterarSenha)
    app.get('/mail-pass-change',       Mail.EmailAlterarSenha)
    app.get('/mail-pass-recovery',     Mail.EmailRecuperarSenha)


// --------- USUARIO
    app.get('/token-messenger',        Usuario.estaLogado, Usuario.GerarTokenMessenger)
    app.get('/todas-assinaturas',      Usuario.estaLogado, Usuario.ListarAssinaturas)
    app.post('/atualizar-assinaturas', Usuario.estaLogado, Usuario.AtualizarAssinaturas)
    app.post('/subscribe/:id',         Usuario.estaLogado, Usuario.AssinarNotificacoes)
    app.post('/unsubscribe/:id',       Usuario.estaLogado, Usuario.DesassinarNotificacoes)
    app.put('/me/change',              Usuario.estaLogado, Usuario.AlterarPerfil)
    app.get('/me',                     Usuario.estaLogado, Usuario.ExibirPerfil)
    app.get('/profiles',               Usuario.ListarUsuarios)
    app.get('/profile/:id',            Usuario.ConsultarPerfil)

// --------- MAPA
    app.get('/mapa',                   Mapa.ExibirMapa)

}