var express 	= require('express'); 
var mongoose 	= require('mongoose'); 
var bodyParser 	= require('body-parser'); 
var Mesure   	= require('./app/models/mesure');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
                
var host = "localhost";
var port = 5555;
    
//Connexion à la base de donnée mongo
mongoose.connect('mongodb://localhost:27017/mesures', options);//Connexion string
mongoose.Promise = global.Promise;
 
var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
}); 

//Création d'un objet de type express 
var app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//On créer un router qui sera en charge de router les endpoints de l'API que nous implémentons plus bas dans le code
var router = express.Router(); 

//On crée un route simple pour vérifier que l'API fonctionne.
router.route('/')

.all(function(req,res){ 
      res.json({message : "Bienvenue sur l'API ", methode : req.method});
});

//Route pour les mesures
router.route('/mesures')

//Methode get : toutes les mesures
.get(function(req,res){ 
		Mesure.find({}, function (err, mesure) {
			if(err){
				res.send(err);
			}
		res.json(mesure);
		console.log("GET all mesures");
		})
})

//Methode POST : une nouvelle mesure
.post(function(req, res){
    var newMesure = new Mesure();
    newMesure.temperature = req.body.temperature;
    newMesure.humidite = req.body.humidite;
    newMesure.date = new Date().getTime();

    newMesure.save(function(err){
        if(err){
            res.send(err);
        }
        res.json({message: "Mesure correctement sauvegardée !"})
        console.log("POST new mesure");
    })

})

//Nouvelle route : dernière mesure
router.route('/mesures/last')
//Methode get : dernière mesure
.get(function(req,res){ 
    Mesure.find({}, function (err, mesure) {
        if(err){
            res.send(err);
        }
    res.json(mesure);
    console.log("GET last mesure");
    }).sort({date: -1}).limit(1)
})

//On utilise notre router
app.use(router);  

//On démarre le serveur sur l'host et le port spécifié 
app.listen(port, host, function(){
        console.log("API accessible sur http://"+host+":"+port); 
});