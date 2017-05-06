// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        name: String,
        email: String,
        password: String,
        usuario_fb: String,
        subscribers: [{
            email: String,
            usuario_fb: String,
            nome: String
        }],
        token_recovery: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        subscribers: [{
            email: String,
            nome: String
        }]
    },
    notificacoes: {
        email: { type: Boolean, default: false },
        messenger: { type: Boolean, default: false },
        token: { type: String, default: '' },
        usuario_fb: { type: String, default: '' }
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);