// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var emailnotificationSchema = mongoose.Schema({
    usuario: String,
    mensagem: String,
    link: String,
    img: String,
    enviada: { type: Boolean, default: false }
});

// generating a hash
emailnotificationSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
emailnotificationSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('EmailNotificacao', emailnotificationSchema);