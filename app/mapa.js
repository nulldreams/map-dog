const Animal = require('./models/animal.js')

exports.ExibirMapa = (req, res) => {
    ConsultaBichinhos((animais) => {
        res.json({ status: 200, result: animais })
    })
}

var ConsultaBichinhos = (callback) => {
    Animal.find({}, (err, animais) => {
        callback(animais)
    })
}