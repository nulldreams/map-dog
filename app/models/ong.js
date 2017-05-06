// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var ongSchema = mongoose.Schema({
    name: String,
    cnpj: String,
    telefone: String,
    endereco: String,
    responsaveis: [String],
    quantidade_animais: Number,
    tipo_perfil: String,
    ativo: Boolean, //Para identificar quando ele está logado ou não.
    animais: [{
        id: String
    }],
        subscribers: [{
            email: String,
            nome: String
        }],
    email: String,
    password: String,
    token_recovery: String
});

// generating a hash
ongSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
ongSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Ong', ongSchema);