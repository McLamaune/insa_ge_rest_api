//Récupération d'une instance de mongoose et mongoose.Schema
var mongoose = require('mongoose');
var Schema 	= mongoose.Schema;

//Création d'un nouveau schéma et initialisation avec module.exports
module.exports = mongoose.model('Mesure', new Schema({ 
    temperature: 	Number, 
    humidite: 		Number,    
    date:			Number
}));