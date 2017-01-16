var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var bdd_singleton = require('./bdd_singleton'); // BDD
var session = require('express-session');
var router = express();


/* Middleware permettant de récupérer les données de la session dans une vue*/
localSession = function(req, res, next) {
    res.locals.session = req.session;
    next();
};

router.get('/',localSession, function (req, res) {
    var sess = req.session;
//Session set when user Request our app via URL
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/main');
    }
    else {
        res.redirect('/login');
    }
});


router.get('/login', function (req, res) {
    var sess = req.session;
//Session set when user Request our app via URL
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/main');
    }
    else {
        res.render('login');
    }

});

/*-- TENTATIVE DE LOGIN --*/
router.post('/login', function (req, res) {

    bdd_singleton.doQuery("SELECT * FROM USER", function(err,rows,fields){
        if(err){
            res.render('login',{error_message : "Unable to connect users database, please try later"});
        }
        else
        {
            var rowsLength = rows.length;
            for (var i = 0; i < rowsLength; i++) {

                if(req.body.username == rows[i].username && req.body.password == rows[i].password){
                    //TODO demarrer session
                    var sess = req.session;
                    sess.username=req.body.username;
                    res.redirect('/main');

                }

            }
            if(!sess.username)
                res.render('login',{error_message : "Bad username/password :("});


        }
    });

});

router.get('/main',localSession,function(req,res){
    var sess = req.session;

    if(sess.username){
        res.render("main");
    }
    else {
        res.render('login', {error_message: "Veuillez vous connecter"});
    }

});

router.get('/register', function (req, res) {
    // TODO ajouter un nouveau utilisateur
});
/* On affiche le profile  */
router.get('/profile',localSession, function (req, res) {
    var sess = req.session;
    if(sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */

        //TODO Récuperer les infos de l'utilisateur et les passer à la vue
        res.render('profile');
    }
    else {
        //res.write("<strong style='color:rgba(255,62,43,0.93)'>Veuillez vous connecter<strong>");
        res.redirect("/login");
    }
});

router.get('/inscription', function(req,res){
    res.render('inscription');
});

router.post('/inscription', function(req,res){
//Connexion bdd
    //if (deja email deja dans la bdd)
        //redirect main
    //else
        //add to db
    render('inscription',{error_message:"e-mail déjà utilisée"})

    bdd_singleton.doQuery("SELECT * FROM USER", function(err,rows,fields){

        if(err){
            res.render('inscription',{error_message : "Unable to connect users database, please try later"});
        }
        else
        {
            var rowsLength = rows.length;
            for (var i = 0; i < rowsLength; i++) {

                if(req.body.email == rows[i].email){

                    render('inscription',{error_message:"e-mail déjà utilisée"})

                }

            }

        }
    });



    });


module.exports = router;
