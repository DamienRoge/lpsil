var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var bdd_singleton = require('./bdd_singleton'); // BDD
var session = require('express-session');
var inscription = express();


inscripiton