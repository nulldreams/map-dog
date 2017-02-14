// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var AnimalSchema = new Schema({
    tipo: {type: String, required: true},               // Cachorro, gato, cavalo
    cor: {type: String, required: true}, 
    porte: {type: String, required: true}, 
    genero: {type: String, required: true},             // Macho ou Femea
    idade: {type: String, required: true},                // Deixar disponivel para adicoinar "Novo", "Adulto", "Velho"
    descricao: {type: String, required: true},        // Descrição
    localizacao: {type: [Number], required: true},         // [Long, Lat]
    img: { data: String },                              // Caminho da imagem no server
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
AnimalSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
AnimalSchema.index({location: '2dsphere'});

// Exports the AnimalSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-user"
module.exports = mongoose.model('animal', AnimalSchema);
