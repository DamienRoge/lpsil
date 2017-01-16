var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var bdd_singleton = require('./bdd_singleton'); // BDD
var session = require('express-session');
var app = express();

// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('combined')); // Active le middleware de logging

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

logger.info('server start');

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }})); //Timeout de 10 min


/* On affiche le formulaire d'enregistrement */

var routes = require('./routes');
app.use('/', routes);


app.listen(1313);
