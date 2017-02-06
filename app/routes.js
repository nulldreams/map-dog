// Dependencies
var mongoose        = require('mongoose');
var Animal          = require('./models/animal.js')
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

module.exports = (app) => {

	app.get('/', (req, res) => {

		res.render('pages/home')
	})

    app.get('/animals', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Animal.find({});
        query.exec(function(err, animals){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all users
                res.json(animals);
            }
        });
    })	

    app.get('/animal/:id', (req, res) => {

        Animal.findById(req.params.id, (err, _animal) => {
            if(err) console.error(err)

            res.render('pages/animal', { animal: _animal})
        })
    }) 

	app.post('/animal', upload.single('animal'), (req, res, next) => {

		console.log(req.body)
		var newAnimal = Animal({
			tipo: req.body.tipo,
			genero: req.body.genero,
			idade: req.body.idade,
			descricao: req.body.descricao,
			localizacao: [req.body.lng, req.body.lat],
			img: { data: req.file.filename }
		})

		newAnimal.save((err, animal) => {
			if(err) console.error(err)

			Animal.findById(animal, (err, doc) => {
				if(err) return next(err)
				console.log(doc)
				res.json({ success : true })
			})
		})
	})
}