// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var notificacaoSchema = mongoose.Schema({
    usuario: String,
    mensagem: String,
    enviada: { type: Boolean, default: false }
});

// generating a hash
notificacaoSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
notificacaoSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Notificacao', notificacaoSchema);