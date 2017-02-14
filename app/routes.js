// Dependencies
var mongoose        = require('mongoose');
var Animal          = require('./models/animal.js')
var User            = require('./models/user.js')
var Schema          = mongoose.Schema
var fs              = require('fs')
var multer          = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})

var upload = multer({ storage: storage })

module.exports = (app, passport, router, io) => {

    require('./autenticacao.js')(app, passport)

    require('./mail.js')(app)

    require('./user.js')(app)
    
    require('./animal.js')(app)

    app.get('/mapa', (req, res) =>{
      console.log(req.user)

        res.render('pages/mapa', { user: req.user })
    })   
}